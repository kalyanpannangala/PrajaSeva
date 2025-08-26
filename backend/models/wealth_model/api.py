# api.py
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
from pathlib import Path
from typing import List, Tuple

app = FastAPI(title="Wealth & Investment Recommendation API")

# --------- Load ML Model ---------
# Locates the model file relative to the api.py script
base_dir = Path(__file__).resolve().parent
try:
    pipeline = joblib.load(base_dir / "investment_model.pkl")
except Exception as e:
    pipeline = None
    print(f"⚠️ Could not load ML model: {e}")

# --------- Request & Response Schemas ---------
class WealthRequest(BaseModel):
    user_age: int
    retirement_age: int
    current_savings: float
    monthly_investment: float
    expected_return: float
    risk_tolerance: str
    liquidity: str
    annual_step_up: float

class ProjectionRow(BaseModel):
    year: int
    # Changed from float to str for comma formatting
    opening_capital: str
    annual_investment: str
    interest_earned: str
    closing_capital: str

class SchemeRecommendation(BaseModel):
    scheme_name: str
    confidence: float # e.g., 0.95 for 95%

class WealthResponse(BaseModel):
    # Changed from float to str for comma formatting
    projected_corpus: str
    inflation_adjusted_corpus: str
    projection_data: List[ProjectionRow]
    recommended_schemes: List[SchemeRecommendation]


# --------- API Endpoint ---------
@app.post("/predict", response_model=WealthResponse)
def predict_wealth(data: WealthRequest):
    # --- Step 1: Wealth Projection Calculation ---
    years_to_invest = data.retirement_age - data.user_age
    annual_investment = data.monthly_investment * 12
    corpus = data.current_savings
    inflation_rate = 4.0  # Using a more realistic inflation rate

    projection_data = []

    # Ensure years_to_invest is not negative
    if years_to_invest > 0:
        for year in range(1, years_to_invest + 1):
            opening_cap_float = corpus
            annual_inv_float = annual_investment
            interest_earned_float = corpus * (data.expected_return / 100)
            
            corpus += interest_earned_float + annual_inv_float
            
            projection_data.append(ProjectionRow(
                year=year,
                # Format numbers as comma-separated strings
                opening_capital=f"{opening_cap_float:,.2f}",
                annual_investment=f"{annual_inv_float:,.2f}",
                interest_earned=f"{interest_earned_float:,.2f}",
                closing_capital=f"{corpus:,.2f}"
            ))
            # Apply annual step-up for the next year's investment
            annual_investment *= (1 + data.annual_step_up / 100)

    inflation_adjusted_corpus = corpus / ((1 + inflation_rate / 100) ** years_to_invest) if years_to_invest > 0 else corpus

    # --- Step 2: ML Model Prediction (Updated Logic) ---
    recommended_schemes = []
    if pipeline:
        try:
            input_data = pd.DataFrame([{
                "user_age": data.user_age,
                "investment_amount": data.monthly_investment * 12,
                "years_to_invest": years_to_invest,
                "risk_level": data.risk_tolerance,
                "liquidity": data.liquidity
            }])

            # Get probabilities for all schemes
            all_probabilities = pipeline.predict_proba(input_data)[0]
            all_scheme_labels = pipeline.classes_

            # Pair schemes with probabilities
            scheme_recommendations_with_prob = []
            for i, scheme_name in enumerate(all_scheme_labels):
                probability = all_probabilities[i]
                scheme_recommendations_with_prob.append((scheme_name, probability))
            
            # Sort by probability (highest first)
            scheme_recommendations_with_prob.sort(key=lambda x: x[1], reverse=True)

            # Get the top N recommendations
            top_n = 5
            top_schemes = scheme_recommendations_with_prob[:top_n]

            # Format for the response model
            for scheme, prob in top_schemes:
                recommended_schemes.append(SchemeRecommendation(
                    scheme_name=scheme,
                    confidence=round(prob, 4)
                ))

        except Exception as e:
            print(f"Prediction error: {e}")


    # --- Step 3: Return the final response ---
    return WealthResponse(
        # Format final numbers as comma-separated strings
        projected_corpus=f"{corpus:,.2f}",
        inflation_adjusted_corpus=f"{inflation_adjusted_corpus:,.2f}",
        projection_data=projection_data,
        recommended_schemes=recommended_schemes
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
