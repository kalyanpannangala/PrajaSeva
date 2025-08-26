from pathlib import Path
import joblib
import numpy as np

def main():
    print("Enter taxpayer details (press Enter to accept default where shown):")
    
    age = int(input("Age : ") or 30)
    income = float(input("Annual Income (gross) : ") or 500000)
    is_salaried = (input("Are you salaried? (y/n): ").strip().lower() or "y") == "y"
    inv_80c = float(input("Investment under 80C (Rs): ") or 0)
    inv_80d = float(input("Investment under 80D (Rs) : ") or 0)
    home_loan_interest = float(input("Home loan interest paid this FY (Rs): ") or 0)
    edu_loan_interest = float(input("Education loan interest paid this FY (Rs): ") or 0)
    donations = float(input("Donations eligible under 80G (Rs): ") or 0)
    other_deductions = float(input("Other deductions (80TTA/80TTB etc) (Rs): ") or 0)

    # ---------- Deterministic Tax Calculation ----------
    std_deduction_old = 50000
    std_deduction_new = 75000 if is_salaried else 0

    taxable_old = income - std_deduction_old - min(inv_80c, 150000) - min(inv_80d, 50000) \
                  - min(home_loan_interest, 200000) - edu_loan_interest - donations - other_deductions
    taxable_old = max(taxable_old, 0)

    taxable_new = income - std_deduction_new
    taxable_new = max(taxable_new, 0)

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
        return tax * 1.04

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
        return tax * 1.04

    tax_old = calc_old_regime_tax(taxable_old)
    tax_new = calc_new_regime_tax(taxable_new)

    recommended = "Old Regime" if tax_old < tax_new else "New Regime"

    # ---------- ML Model Prediction ----------
    try:
        base_dir = Path(__file__).resolve().parent
        ml_model = joblib.load(base_dir / "tax_model.pkl")
        # Load feature order if available; fallback to training-time default
        try:
            feature_columns = joblib.load(base_dir / "feature_columns.pkl")
        except Exception:
            feature_columns = [
                'age','annual_income','is_salaried','investment_80c','investment_80d',
                'home_loan_interest','education_loan_interest','donations_80g','other_deductions','standard_deduction'
            ]

        standard_deduction = 50000 if is_salaried else 0
        # Create DataFrame with exact feature names and order from training
        import pandas as pd
        input_data = pd.DataFrame([[
            age,
            income,
            int(is_salaried),
            inv_80c,
            inv_80d,
            home_loan_interest,
            edu_loan_interest,
            donations,
            other_deductions,
            standard_deduction
        ]], columns=feature_columns)
        
        ml_prediction = ml_model.predict(input_data)[0]

        # In training: y = (best_regime == 'old').astype(int) → 1 means Old Regime
        ml_recommendation = "Old Regime" if int(ml_prediction) == 1 else "New Regime"

    except FileNotFoundError:
        ml_recommendation = "ML model file not found."
    except Exception as e:
        ml_recommendation = f"Error: {str(e)}"

    # ---------- Output ----------
    print("\n--- Calculation Summary ---")
    print(f"Taxable Income (Old Regime– FY 2024–25): ₹{taxable_old:,.0f}")
    print(f"Estimated Tax under Old Regime: ₹{tax_old:,.1f}\n")
    print(f"Taxable Income (New Regime– FY 2025–26): ₹{taxable_new:,.0f}")
    print(f"Estimated Tax under New Regime: ₹{tax_new:,.1f}\n")
    print("Recommendation:")
    print(f"- Deterministic calculation recommends: {recommended} (saves ₹{abs(tax_old - tax_new):,.1f})")
    print(f"- Regime recommendation: {ml_recommendation}\n")
    print("Notes:")
    print("- Section 80E (education loan interest) is applied to the Old Regime only.")
    print("- Standard deductions used: Old Regime ₹50,000; New Regime (salaried) ₹75,000.")
    print("- Caps: 80C ₹1,50,000; 80D ₹50,000; Home loan interest ₹2,00,000.")
    print("- Cess 4% added on tax.")

if __name__ == "__main__":
    main()
