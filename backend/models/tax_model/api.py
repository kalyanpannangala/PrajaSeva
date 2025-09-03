# tax_model/api.py
import os
import json
from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel
from pathlib import Path
import joblib
import pandas as pd
import psycopg2
from psycopg2.extras import DictCursor
from jose import JWTError, jwt
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer

# --- Environment Setup ---
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"

app = FastAPI(title="Tax Model API")

# --- Security & Authentication ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id: str = payload.get("userId")
        if user_id is None:
            raise credentials_exception
        return user_id
    except JWTError:
        raise credentials_exception

# --- Database Connection ---
def get_db_connection():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        # Keep error message generic for security, but log in your infra if needed
        raise HTTPException(status_code=500, detail="Database connection failed.")

# --- Load ML Model & Data ---
base_dir = Path(__file__).resolve().parent
ml_model = joblib.load(base_dir / "tax_model.pkl") if (base_dir / "tax_model.pkl").exists() else None
feature_columns = joblib.load(base_dir / "feature_columns.pkl") if (base_dir / "feature_columns.pkl").exists() else [
    'age','annual_income','is_salaried','investment_80c','investment_80d',
    'home_loan_interest','education_loan_interest','donations_80g','other_deductions','standard_deduction'
]

# --- Pydantic model for data validation ---
class TaxInput(BaseModel):
    age: int
    annual_income: float
    is_salaried: bool
    investment_80c: float = 0
    investment_80d: float = 0
    home_loan_interest: float = 0
    education_loan_interest: float = 0
    donations_80g: float = 0
    other_deductions: float = 0

# -------- Helper Functions --------
def calc_old_regime_tax(taxable):
    # same old-regime logic you had — preserved
    tax = 0
    if taxable <= 250000:
        tax = 0
    elif taxable <= 500000:
        tax = 0.05 * (taxable - 250000)
    elif taxable <= 1000000:
        tax = 12500 + 0.2 * (taxable - 500000)
    else:
        tax = 112500 + 0.3 * (taxable - 1000000)
    return tax * 1.04  # Add 4% cess

# --- FIXED New Regime Tax Calculation (FY 2025–26) ---
def calc_new_regime_tax(taxable_income):
    """
    New regime FY 2025-26:
    - Standard deduction already applied outside this function.
    - If taxable_income <= 12,00,000 → tax = 0 (rebate zone per Budget 2025 simplified rule).
    - Otherwise, apply slabs:
        0 - 4,00,000       : 0%
        4,00,001 - 8,00,000: 5%
        8,00,001 - 12,00,000: 10%
        12,00,001 - 16,00,000: 15%
        16,00,001 - 20,00,000: 20%
        20,00,001 - 24,00,000: 25%
        24,00,001+          : 30%
    - Finally add 4% cess.
    """
    # Rebate zone: taxable <= 12L → effectively zero tax under new regime rules used here
    if taxable_income <= 1_200_000:
        return 0.0

    tax = 0.0
    # slab calculations (only on amounts above each lower bound)
    # 0 - 4,00,000 -> 0%
    if taxable_income > 400000:
        # 4L - 8L @5%
        tax += max(0.0, min(taxable_income, 800000) - 400000) * 0.05
    if taxable_income > 800000:
        # 8L - 12L @10%
        tax += max(0.0, min(taxable_income, 1200000) - 800000) * 0.10
    if taxable_income > 1200000:
        # 12L - 16L @15%
        tax += max(0.0, min(taxable_income, 1600000) - 1200000) * 0.15
    if taxable_income > 1600000:
        # 16L - 20L @20%
        tax += max(0.0, min(taxable_income, 2000000) - 1600000) * 0.20
    if taxable_income > 2000000:
        # 20L - 24L @25%
        tax += max(0.0, min(taxable_income, 2400000) - 2000000) * 0.25
    if taxable_income > 2400000:
        # above 24L @30%
        tax += (taxable_income - 2400000) * 0.30

    return tax * 1.04  # add 4% cess

# --- API Endpoint ---
@app.post("/predict_tax")
def predict_tax(user_id: str = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=DictCursor)
    try:
        cursor.execute("SELECT * FROM tax_input WHERE user_id = %s ORDER BY created_at DESC LIMIT 1", (user_id,))
        user_input_data = cursor.fetchone()
        if not user_input_data:
            raise HTTPException(status_code=404, detail="No tax input data found for this user.")

        # convert DB row (DictCursor) to pydantic model (fields must match)
        data = TaxInput(**user_input_data)

        # Standard deductions
        std_deduction_old = 50000
        # NEW STD DEDUCTION FOR SALARIED (FY 2025-26)
        std_deduction_new = 75000 if data.is_salaried else 0

        # Compute taxable incomes (respect caps you've used before)
        taxable_old = data.annual_income \
                      - std_deduction_old \
                      - min(data.investment_80c, 150000) \
                      - min(data.investment_80d, 50000) \
                      - min(data.home_loan_interest, 200000) \
                      - data.education_loan_interest \
                      - data.donations_80g \
                      - data.other_deductions
        taxable_old = max(taxable_old, 0)

        taxable_new = data.annual_income - std_deduction_new
        taxable_new = max(taxable_new, 0)

        # Compute tax amounts using helper functions
        tax_old = calc_old_regime_tax(taxable_old)
        tax_new = calc_new_regime_tax(taxable_new)

        recommended = "Old Regime" if tax_old < tax_new else "New Regime"
        tax_saving = abs(tax_old - tax_new)

        notes = [
            "Section 80E (education loan interest) is applied to the Old Regime only.",
            f"Standard deductions used: Old Regime ₹{std_deduction_old:,}; New Regime {'₹'+str(std_deduction_new) if std_deduction_new else '₹0'}.",
            "Caps: 80C ₹1,50,000; 80D ₹50,000; Home loan interest ₹2,00,000.",
            "Cess 4% added on tax."
        ]

        upsert_query = """
            INSERT INTO tax (user_id, taxable_income_old, tax_old, taxable_income_new, tax_new, recommended_regime, tax_saving, notes, generated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW())
            ON CONFLICT (user_id) DO UPDATE SET
                taxable_income_old = EXCLUDED.taxable_income_old, tax_old = EXCLUDED.tax_old,
                taxable_income_new = EXCLUDED.taxable_income_new, tax_new = EXCLUDED.tax_new,
                recommended_regime = EXCLUDED.recommended_regime, tax_saving = EXCLUDED.tax_saving,
                notes = EXCLUDED.notes, generated_at = NOW();
        """
        cursor.execute(upsert_query, (user_id, taxable_old, tax_old, taxable_new, tax_new, recommended, tax_saving, json.dumps(notes)))
        conn.commit()

        ml_recommendation = "Not available"
        if ml_model:
            # --- FIX: use NEW standard deduction in ML input to reflect FY 2025–26 ---
            standard_deduction = 75000 if data.is_salaried else 0
            input_data = pd.DataFrame(
                [[
                    data.age,
                    data.annual_income,
                    int(data.is_salaried),
                    data.investment_80c,
                    data.investment_80d,
                    data.home_loan_interest,
                    data.education_loan_interest,
                    data.donations_80g,
                    data.other_deductions,
                    standard_deduction
                ]],
                columns=feature_columns
            )
            ml_prediction = ml_model.predict(input_data)[0]
            ml_recommendation = "Old Regime" if int(ml_prediction) == 1 else "New Regime"

        return {
            "calculation_summary": {
                "taxable_income_old": taxable_old, "tax_old": round(tax_old, 2),
                "taxable_income_new": taxable_new, "tax_new": round(tax_new, 2),
            },
            "recommendation": {
                "deterministic": recommended, "ml_recommendation": ml_recommendation,
                "tax_saving": round(tax_saving, 2)
            },
        "notes": [
            "Old Regime (FY 2024–25 rules): includes deductions (80C, 80D, 80E, home loan interest, etc.).",
            "New Regime (FY 2025–26 rules): only standard deduction (₹75,000 for salaried).",
            "Section 80E (education loan interest) is applied to the Old Regime only.",
            f"Standard deductions used: Old Regime ₹{std_deduction_old:,}; New Regime {'₹'+str(std_deduction_new) if std_deduction_new else '₹0'}.",
            "Caps: 80C ₹1,50,000; 80D ₹50,000; Home loan interest ₹2,00,000.",
            "Cess 4% added on tax."
        ]
        }

    

    except Exception as e:
        conn.rollback()
        # surface safe error to client
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    finally:
        cursor.close()
        conn.close()
    