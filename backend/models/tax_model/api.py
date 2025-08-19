from fastapi import FastAPI
from pydantic import BaseModel
from pathlib import Path
import joblib
import pandas as pd

app = FastAPI(title="Tax Model API")

# -------- Load ML Model --------
base_dir = Path(__file__).resolve().parent
try:
    ml_model = joblib.load(base_dir / "tax_model.pkl")
except FileNotFoundError:
    ml_model = None

try:
    feature_columns = joblib.load(base_dir / "feature_columns.pkl")
except Exception:
    feature_columns = [
        'age','annual_income','is_salaried','investment_80c','investment_80d',
        'home_loan_interest','education_loan_interest','donations_80g','other_deductions','standard_deduction'
    ]

# -------- Request Schema --------
class TaxInput(BaseModel):
    age: int = 30
    annual_income: float = 500000
    is_salaried: bool = True
    investment_80c: float = 0
    investment_80d: float = 0
    home_loan_interest: float = 0
    education_loan_interest: float = 0
    donations_80g: float = 0
    other_deductions: float = 0

# -------- Helper Functions --------
def calc_old_regime_tax(taxable):
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

def calc_new_regime_tax(taxable):
    slabs = [300000, 600000, 900000, 1200000, 1500000]
    rates = [0.00, 0.05, 0.10, 0.15, 0.20, 0.30]
    prev_limit = 0
    tax = 0
    for i, limit in enumerate(slabs):
        if taxable > limit:
            tax += (limit - prev_limit) * rates[i]
            prev_limit = limit
        else:
            tax += (taxable - prev_limit) * rates[i]
            break
    return tax * 1.04  # Add 4% cess

# -------- API Endpoint --------
@app.post("/predict_tax")
def predict_tax(data: TaxInput):
    # Deterministic Calculation
    std_deduction_old = 50000
    std_deduction_new = 75000 if data.is_salaried else 0

    taxable_old = data.annual_income - std_deduction_old \
                  - min(data.investment_80c, 150000) \
                  - min(data.investment_80d, 50000) \
                  - min(data.home_loan_interest, 200000) \
                  - data.education_loan_interest \
                  - data.donations_80g \
                  - data.other_deductions
    taxable_old = max(taxable_old, 0)

    taxable_new = data.annual_income - std_deduction_new
    taxable_new = max(taxable_new, 0)

    tax_old = calc_old_regime_tax(taxable_old)
    tax_new = calc_new_regime_tax(taxable_new)

    recommended = "Old Regime" if tax_old < tax_new else "New Regime"

    # ML Model Prediction
    if ml_model:
        standard_deduction = 50000 if data.is_salaried else 0
        input_data = pd.DataFrame([[  # Ordered features
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
        ]], columns=feature_columns)
        
        ml_prediction = ml_model.predict(input_data)[0]
        ml_recommendation = "Old Regime" if int(ml_prediction) == 1 else "New Regime"
    else:
        ml_recommendation = "ML model file not found."

    # Notes (exactly like predict.py)
    notes = [
        "Section 80E (education loan interest) is applied to the Old Regime only.",
        f"Standard deductions used: Old Regime ₹{std_deduction_old:,}; New Regime {'₹'+str(std_deduction_new) if std_deduction_new else '₹0'}.",
        "Caps: 80C ₹1,50,000; 80D ₹50,000; Home loan interest ₹2,00,000.",
        "Cess 4% added on tax."
    ]

    # Build rich response
    return {
        "calculation_summary": {
            "taxable_income_old": taxable_old,
            "tax_old": round(tax_old, 2),
            "taxable_income_new": taxable_new,
            "tax_new": round(tax_new, 2),
        },
        "recommendation": {
            "deterministic": recommended,
            "ml_recommendation": ml_recommendation,
            "tax_saving": round(abs(tax_old - tax_new), 2)
        },
        "notes": notes
    }
