import joblib
import pandas as pd

print("\n💰 Wealth & Investment Recommendation Tool\n")

# --- Step 1: Get user input ---
user_age = int(input("Enter your current age: "))
retirement_age = int(input("Enter your planned retirement age: "))
current_savings = float(input("Enter your current savings (₹): "))
monthly_investment = float(input("Enter your monthly investment amount (₹): "))
expected_return = float(input("Enter expected annual return rate (%): "))
risk_tolerance = input("Enter your risk tolerance (Zero Risk / Low Risk / Moderate): ").strip()
liquidity = input("Enter desired liquidity (High / Medium / Low): ").strip()
annual_step_up = float(input("Enter annual step-up percentage for SIP: "))

# --- Step 2: Wealth Projection ---
years_to_invest = retirement_age - user_age
annual_investment = monthly_investment * 12
corpus = current_savings
inflation_rate = 2.5

projection_data = []

for year in range(1, years_to_invest + 1):
    interest_earned = corpus * (expected_return / 100)
    corpus += interest_earned + annual_investment
    projection_data.append([
        year,
        round(corpus - annual_investment - interest_earned, 2),  # Opening capital
        round(annual_investment, 2),
        round(interest_earned, 2),
        round(corpus, 2)
    ])
    # Step up SIP
    annual_investment *= (1 + annual_step_up / 100)

inflation_adjusted_corpus = corpus / ((1 + inflation_rate / 100) ** years_to_invest)

# --- Step 3: Display Projection ---
print(f"\n📊 Your projected corpus at retirement: ₹{corpus:,.2f}")
print(f"💸 Inflation-adjusted corpus (₹, {inflation_rate}% inflation): ₹{inflation_adjusted_corpus:,.2f}")

print("\n📈 Year-wise SIP Growth Plan:\n")
print("Year    Opening Capital    Annual Investment      Interest Earned      Closing Capital")
for row in projection_data:
    print(f"{row[0]:>4}    {row[1]:>16,.2f}    {row[2]:>18,.2f}    {row[3]:>18,.2f}    {row[4]:>18,.2f}")

# --- Step 4: Load ML Model ---
pipeline = joblib.load("investment_model.pkl")

# --- Step 5: Prepare Features for Prediction ---
input_data = pd.DataFrame([{
    "user_age": user_age,
    "investment_amount": monthly_investment * 12,
    "years_to_invest": years_to_invest,
    "risk_level": risk_tolerance,
    "liquidity": liquidity
}])

# --- Step 6: Predict All Eligible Schemes ---
try:
    proba = pipeline.predict_proba(input_data)[0]  # Probabilities for all classes
    scheme_labels = pipeline.classes_              # All possible schemes
    eligible_schemes = [
        scheme_labels[i]
        for i, p in enumerate(proba)
        if p >= 0.2  # threshold for eligibility
    ]

    if eligible_schemes:
        print("\n🎯 You are eligible for the following schemes:")
        for scheme in eligible_schemes:
            print(f" - {scheme}")
    else:
        print("\n⚠️ No matching schemes found for your profile.")

except Exception as e:
    print(f"\n⚠️ Prediction error: {e}")
