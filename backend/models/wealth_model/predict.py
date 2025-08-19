import joblib
import pandas as pd

print("\n💰 Wealth & Investment Recommendation Tool\n")

# --- Step 1: Get user input ---
# (This entire section remains unchanged)
user_age = int(input("Enter your current age: "))
retirement_age = int(input("Enter your planned retirement age: "))
current_savings = float(input("Enter your current savings (₹): "))
monthly_investment = float(input("Enter your monthly investment amount (₹): "))
expected_return = float(input("Enter expected annual return rate (%): "))
risk_tolerance = input("Enter your risk tolerance (Zero Risk / Low Risk / Moderate): ").strip()
liquidity = input("Enter desired liquidity (High / Medium / Low): ").strip()
annual_step_up = float(input("Enter annual step-up percentage for SIP (%): "))

# --- Step 2: Wealth Projection ---
# (This entire section remains unchanged)
years_to_invest = retirement_age - user_age
annual_investment = monthly_investment * 12
corpus = current_savings
inflation_rate = 4.0 # Using a more realistic inflation rate

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
# (This entire section remains unchanged)
print(f"\n📊 Your projected corpus at retirement: ₹{corpus:,.2f}")
print(f"💸 Inflation-adjusted corpus (at {inflation_rate}% avg. inflation): ₹{inflation_adjusted_corpus:,.2f}")

print("\n📈 Year-wise SIP Growth Plan:\n")
print("Year    Opening Capital     Annual Investment      Interest Earned       Closing Capital")
print("-" * 80)
for row in projection_data:
    print(f"{row[0]:>4}   {row[1]:>16,.2f}   {row[2]:>18,.2f}   {row[3]:>18,.2f}   {row[4]:>18,.2f}")

# --- Step 4: Load ML Model ---
try:
    pipeline = joblib.load("investment_model.pkl")
except FileNotFoundError:
    print("\n⚠️ Error: `investment_model.pkl` not found. Please train the model first.")
    exit()

# --- Step 5: Prepare Features for Prediction ---
input_data = pd.DataFrame([{
    "user_age": user_age,
    "investment_amount": monthly_investment * 12, # Use annual investment for consistency
    "years_to_invest": years_to_invest,
    "risk_level": risk_tolerance,
    "liquidity": liquidity
}])

# --- Step 6: Predict All Eligible Schemes (Corrected Logic) ---
try:
    # Get probabilities for all possible schemes
    all_probabilities = pipeline.predict_proba(input_data)[0]
    
    # Get the names of all schemes the model knows
    all_scheme_labels = pipeline.classes_
    
    # Pair each scheme with its probability score
    scheme_recommendations = []
    for i, scheme_name in enumerate(all_scheme_labels):
        probability = all_probabilities[i]
        scheme_recommendations.append((scheme_name, probability))
        
    # Sort the recommendations by probability (highest first)
    scheme_recommendations.sort(key=lambda x: x[1], reverse=True)

    # Display the top N recommendations
    top_n = 5
    top_schemes = scheme_recommendations[:top_n]

    if top_schemes:
        print("\n🎯 Based on your profile, here are your top 5 recommended investment schemes:")
        for i, (scheme, prob) in enumerate(top_schemes):
            print(f" {i+1}. {scheme} (Confidence: {prob:.0%})")
    else:
        print("\n⚠️ Could not determine recommendations. Please check your inputs.")

except Exception as e:
    print(f"\n⚠️ An error occurred during prediction: {e}")
