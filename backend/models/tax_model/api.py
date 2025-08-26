# tax_model/api.py
import os
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
        if user_id is None: raise credentials_exception
        return user_id
    except JWTError:
        raise credentials_exception

# --- Database Connection ---
def get_db_connection():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
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
    investment_80c: float
    investment_80d: float
    home_loan_interest: float
    education_loan_interest: float
    donations_80g: float
    other_deductions: float

# --- Helper Functions ---
def calc_old_regime_tax(taxable):
    tax = 0
    if taxable <= 250000: tax = 0
    elif taxable <= 500000: tax = 0.05 * (taxable - 250000)
    elif taxable <= 1000000: tax = 12500 + 0.2 * (taxable - 500000)
    else: tax = 112500 + 0.3 * (taxable - 1000000)
    return tax * 1.04

def calc_new_regime_tax(taxable):
    slabs = [300000, 600000, 900000, 1200000, 1500000]
    rates = [0.00, 0.05, 0.10, 0.15, 0.20, 0.30]
    prev_limit, tax = 0, 0
    for i, limit in enumerate(slabs):
        if taxable > limit:
            tax += (limit - prev_limit) * rates[i]
            prev_limit = limit
        else:
            tax += (taxable - prev_limit) * rates[i]
            break
    return tax * 1.04

# --- API Endpoint ---
@app.post("/predict_tax")
def predict_tax(user_id: str = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=DictCursor)
    try:
        # 1. Fetch user input data from the 'tax_input' table
        cursor.execute("SELECT * FROM tax_input WHERE user_id = %s ORDER BY created_at DESC LIMIT 1", (user_id,))
        user_input_data = cursor.fetchone()
        if not user_input_data:
            raise HTTPException(status_code=404, detail="No tax input data found for this user.")

        data = TaxInput(**user_input_data)

        # 2. Perform Calculation
        std_deduction_old = 50000
        std_deduction_new = 75000 if data.is_salaried else 0
        taxable_old = data.annual_income - std_deduction_old - min(data.investment_80c, 150000) - min(data.investment_80d, 50000) - min(data.home_loan_interest, 200000) - data.education_loan_interest - data.donations_80g - data.other_deductions
        taxable_old = max(taxable_old, 0)
        taxable_new = data.annual_income - std_deduction_new
        taxable_new = max(taxable_new, 0)
        tax_old = calc_old_regime_tax(taxable_old)
        tax_new = calc_new_regime_tax(taxable_new)
        recommended = "Old Regime" if tax_old < tax_new else "New Regime"
        tax_saving = abs(tax_old - tax_new)

        # 3. Store the output in the 'tax' table
        upsert_query = """
            INSERT INTO tax (user_id, taxable_income_old, tax_old, taxable_income_new, tax_new, recommended_regime, tax_saving, generated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())
            ON CONFLICT (user_id) DO UPDATE SET
                taxable_income_old = EXCLUDED.taxable_income_old, tax_old = EXCLUDED.tax_old,
                taxable_income_new = EXCLUDED.taxable_income_new, tax_new = EXCLUDED.tax_new,
                recommended_regime = EXCLUDED.recommended_regime, tax_saving = EXCLUDED.tax_saving,
                generated_at = NOW();
        """
        cursor.execute(upsert_query, (user_id, taxable_old, tax_old, taxable_new, tax_new, recommended, tax_saving))
        conn.commit()

        # 4. Return the response
        return {
            "calculation_summary": {"tax_old": round(tax_old, 2), "tax_new": round(tax_new, 2)},
            "recommendation": {"deterministic": recommended, "tax_saving": round(tax_saving, 2)}
        }
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    finally:
        cursor.close()
        conn.close()
