# predict.py
import joblib
from pathlib import Path
from tax_utils import compute_tax_old, compute_tax_new

BASE = Path(__file__).resolve().parent

# Load trained model & feature columns
clf = joblib.load(BASE / "tax_model.pkl")
feature_cols = joblib.load(BASE / "feature_columns.pkl")

def get_user_input():
    print("Enter taxpayer details (press Enter to accept default where shown):")
    age = int(input("Age : ") or 30)
    annual_income = int(input("Annual Income (gross) : ") or 800000)
    is_salaried = (input("Are you salaried? (y/n): ") or "y").lower().startswith("y")
    investment_80c = int(input("Investment under 80C (Rs): ") or 0)
    investment_80d = int(input("Investment under 80D (Rs) : ") or 0)
    home_loan_interest = int(input("Home loan interest paid this FY (Rs): ") or 0)
    education_loan_interest = int(input("Education loan interest paid this FY (Rs): ") or 0)
    donations_80g = int(input("Donations eligible under 80G (Rs): ") or 0)
    other_deductions = int(input("Other deductions (80TTA/80TTB etc) (Rs): ") or 0)

    return {
        "age": age,
        "annual_income": annual_income,
        "is_salaried": 1 if is_salaried else 0,
        "investment_80c": investment_80c,
        "investment_80d": investment_80d,
        "home_loan_interest": home_loan_interest,
        "education_loan_interest": education_loan_interest,
        "donations_80g": donations_80g,
        "other_deductions": other_deductions,
        "standard_deduction": 75000 if is_salaried else 0,  # New regime FY 2025–26
    }

def main():
    user = get_user_input()
    gross_income = user["annual_income"]
    is_salaried = bool(user["is_salaried"])

    # Old regime (FY 2024–25)
    old_tax, old_taxable, old_before = compute_tax_old(
        gross_income=gross_income,
        investments_80c=user["investment_80c"],
        insurance_80d=user["investment_80d"],
        home_loan_interest=user["home_loan_interest"],
        education_loan_interest=user["education_loan_interest"],
        other_deductions=user["other_deductions"],
        is_salaried=is_salaried,
    )

    # New regime (FY 2025–26)
    new_tax, new_taxable, new_before = compute_tax_new(
        gross_income=gross_income,
        is_salaried=is_salaried,
    )

    # ML-based recommendation
    X_test = [[user[col] for col in feature_cols]]
    pred = clf.predict(X_test)[0]
    regime_reco = "Old Regime" if pred == 1 else "New Regime"

    print("\n--- Calculation Summary ---")
    print(f"Taxable Income (Old Regime– FY 2024–25): ₹{old_taxable:,.0f}")
    print(f"Estimated Tax under Old Regime: ₹{old_tax:,.1f}")

    print(f"\nTaxable Income (New Regime– FY 2025–26): ₹{new_taxable:,.0f}")
    print(f"Estimated Tax under New Regime: ₹{new_tax:,.1f}")

    print("\nRecommendation:")
    better = "New Regime" if new_tax < old_tax else "Old Regime"
    print(f"- Deterministic calculation recommends: {better}")
    print(f"- Regime recommendation (ML model): {regime_reco}")

    # ✅ Added notes section for clarity
    notes = [
        "Old Regime (FY 2024–25 rules): includes deductions (80C, 80D, 80E, home loan interest, etc.).",
        "New Regime (FY 2025–26 rules): only standard deduction (₹75,000 for salaried).",
        "Section 80E (education loan interest) is applied to the Old Regime only.",
        "Standard deductions used: Old Regime ₹50,000; New Regime ₹75,000 (salaried) or ₹0 (self-employed).",
        "Caps: 80C ₹1,50,000; 80D ₹50,000; Home loan interest ₹2,00,000.",
        "Cess 4% added on tax."
    ]

    print("\nNotes:")
    for n in notes:
        print(f"- {n}")

if __name__ == "__main__":
    main()
