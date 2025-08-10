# predict.py - interactive tax calculator & regime recommendation
import pandas as pd, joblib
from pathlib import Path
from tax_utils import compute_tax_old, compute_tax_new

BASE = Path(__file__).resolve().parent
model = joblib.load(BASE / "tax_model.pkl")
feature_cols = joblib.load(BASE / "feature_columns.pkl")

def ask_float(prompt, default=0.0):
    v = input(prompt).strip()
    if v == "":
        return default
    try:
        return float(v)
    except:
        print("Invalid input, using 0")
        return default

def main():
    print("Enter taxpayer details (press Enter to accept default where shown):")
    age = int(input("Age : ").strip() or 30)
    annual_income = float(input("Annual Income (gross): ").strip() or 500000)
    is_salaried = input("Are you salaried? (y/n): ").strip().lower() or "y"
    is_salaried = 1 if is_salaried in ['y','yes'] else 0
    investment_80c = ask_float("Investment under 80C (Rs) : ")
    investment_80d = ask_float("Investment under 80D (Rs) : ")
    home_loan_interest = ask_float("Home loan interest paid this FY (Rs) : ")
    education_loan_interest = ask_float("Education loan interest paid this FY (Rs) : ")
    donations_80g = ask_float("Donations eligible under 80G (Rs) : ")
    other_deductions = ask_float("Other deductions (80TTA/80TTB etc) (Rs) : ")

    standard_deduction = 50000 if is_salaried==1 else 0

    taxable_old = max(0, annual_income - standard_deduction - min(investment_80c,150000) - min(investment_80d,50000) - min(home_loan_interest,200000) - education_loan_interest - donations_80g - other_deductions)
    taxable_new = max(0, annual_income - min(home_loan_interest,200000))

    tax_old = compute_tax_old(taxable_old)
    tax_new = compute_tax_new(taxable_new)
    saved = round(abs(tax_old - tax_new),2)
    recommended = "Old Regime" if tax_old <= tax_new else "New Regime"

    X = pd.DataFrame([{
        "age": age,
        "annual_income": annual_income,
        "is_salaried": is_salaried,
        "investment_80c": investment_80c,
        "investment_80d": investment_80d,
        "home_loan_interest": home_loan_interest,
        "education_loan_interest": education_loan_interest,
        "donations_80g": donations_80g,
        "other_deductions": other_deductions,
        "standard_deduction": standard_deduction
    }])
    pred = model.predict(X[feature_cols])[0]
    model_choice = "Old Regime" if pred==1 else "New Regime"

    print("\n--- Calculation Summary ---")
    print(f"Taxable Income (Old Regime– FY 2024–25): ₹{int(taxable_old):,}")
    print(f"Estimated Tax under Old Regime: ₹{tax_old:,}")
    print(f"Taxable Income (New Regime– FY 2025–26): ₹{int(taxable_new):,}")
    print(f"Estimated Tax under New Regime: ₹{tax_new:,}")
    print("\nRecommendation:")
    print(f"- Deterministic calculation recommends: {recommended} (saves ₹{saved:,})")
    print(f"- ML model recommends: {model_choice}")
    print("\nNotes:")
    print("- Caps used: 80C up to ₹1,50,000; 80D up to ₹50,000; Home loan interest cap ₹2,00,000 for self-occupied.")
    print("- Rebate under section 87A applied where applicable. Cess 4% added on tax.")
    print("- For precise filing, validate against Form 16 / actual invoices and consult a tax professional.")

if __name__ == '__main__':
    main()