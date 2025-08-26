# wealth_model/api.py
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
from typing import List

# --- Environment Setup & App Initialization ---
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"
app = FastAPI(title="Wealth & Investment Recommendation API")

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

# --- Load ML Model ---
base_dir = Path(__file__).resolve().parent
pipeline = joblib.load(base_dir / "investment_model.pkl") if (base_dir / "investment_model.pkl").exists() else None

# --- Pydantic Schemas ---
class WealthInput(BaseModel):
    user_age: int
    retirement_age: int
    current_savings: float
    monthly_investment: float
    expected_return: float
    risk_tolerance: str
    liquidity: str
    annual_step_up: float

# --- API Endpoint ---
@app.post("/predict")
def predict_wealth(user_id: str = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=DictCursor)
    try:
        # 1. Fetch user input from 'wealth_input' table
        cursor.execute("SELECT * FROM wealth_input WHERE user_id = %s", (user_id,))
        user_input_data = cursor.fetchone()
        if not user_input_data:
            raise HTTPException(status_code=404, detail="No wealth input data found for this user.")
        data = WealthInput(**user_input_data)

        # 2. Wealth Projection Calculation
        years_to_invest = data.retirement_age - data.user_age
        annual_investment = data.monthly_investment * 12
        corpus = data.current_savings
        inflation_rate = 4.0
        projection_data = []

        if years_to_invest > 0:
            for year in range(1, years_to_invest + 1):
                opening_cap = corpus
                annual_inv = annual_investment
                interest_earned = corpus * (data.expected_return / 100)
                corpus += interest_earned + annual_inv
                projection_data.append({
                    "year": year, "opening_capital": f"{opening_cap:,.2f}",
                    "annual_investment": f"{annual_inv:,.2f}", "interest_earned": f"{interest_earned:,.2f}",
                    "closing_capital": f"{corpus:,.2f}"
                })
                annual_investment *= (1 + data.annual_step_up / 100)
        
        inflation_adjusted_corpus = corpus / ((1 + inflation_rate / 100) ** years_to_invest) if years_to_invest > 0 else corpus
        projected_corpus_final = corpus

        # 3. ML Model Prediction
        recommended_schemes = []
        if pipeline:
            input_df = pd.DataFrame([{"user_age": data.user_age, "investment_amount": data.monthly_investment * 12, "years_to_invest": years_to_invest, "risk_level": data.risk_tolerance, "liquidity": data.liquidity}])
            all_probs = pipeline.predict_proba(input_df)[0]
            top_indices = all_probs.argsort()[-5:][::-1] # Get top 5
            for i in top_indices:
                recommended_schemes.append({"scheme_name": pipeline.classes_[i], "confidence": round(all_probs[i], 4)})

        # 4. Store results in 'wealth' table using UPSERT
        upsert_query = """
            INSERT INTO wealth (user_id, projected_corpus, inflation_adjusted_corpus, projection_data, recommended_schemes, generated_at)
            VALUES (%s, %s, %s, %s, %s, NOW())
            ON CONFLICT (user_id) DO UPDATE SET
                projected_corpus = EXCLUDED.projected_corpus,
                inflation_adjusted_corpus = EXCLUDED.inflation_adjusted_corpus,
                projection_data = EXCLUDED.projection_data,
                recommended_schemes = EXCLUDED.recommended_schemes,
                generated_at = NOW();
        """
        cursor.execute(upsert_query, (user_id, projected_corpus_final, inflation_adjusted_corpus, json.dumps(projection_data), json.dumps(recommended_schemes)))
        conn.commit()

        # 5. Return the final response
        return {
            "projected_corpus": f"{projected_corpus_final:,.2f}",
            "inflation_adjusted_corpus": f"{inflation_adjusted_corpus:,.2f}",
            "projection_data": projection_data,
            "recommended_schemes": recommended_schemes
        }
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    finally:
        cursor.close()
        conn.close()
