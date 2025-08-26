# schemes_model/api.py
import os
from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel
import pandas as pd
import joblib
from pathlib import Path
import psycopg2
from psycopg2.extras import DictCursor
from jose import JWTError, jwt
from dotenv import load_dotenv

# --- Environment Setup ---
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"

app = FastAPI(title="Schemes Eligibility API")

# --- Pydantic model for the request body ---
class ProfileData(BaseModel):
    age: int
    gender: str
    state: str
    caste: str
    education_level: str
    employment_type: str
    income: int
    disability_status: bool

# --- Security & Authentication ---
from fastapi.security import OAuth2PasswordBearer
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
pipeline = joblib.load(base_dir / "schemes_model.pkl")
scheme_columns = joblib.load(base_dir / "label_encoder.pkl")
rules_df = pd.read_csv(base_dir / "schemes_rules.csv")

# --- API Endpoint ---
@app.post("/predict")
def predict_schemes(profile: ProfileData, user_id: str = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # 1. Convert input from request body to a DataFrame
        user_data = pd.DataFrame([{
            "age": profile.age,
            "annual_income": profile.income,
            "state": profile.state,
            "gender": profile.gender,
            "caste": profile.caste,
            "employment_type": profile.employment_type,
            "disability_status": "Yes" if profile.disability_status else "No",
            "education_level": profile.education_level
        }])

        # 2. Predict eligibility
        prediction = pipeline.predict(user_data)[0]

        # 3. Filter results
        eligible_schemes = []
        for flag, scheme_id in zip(prediction, scheme_columns):
            if flag == 1:
                scheme_row = rules_df[rules_df["scheme_id"] == scheme_id].iloc[0]
                if scheme_row["scope"].lower() == "state" and user_data.iloc[0]["state"].lower() != scheme_row["state"].lower():
                    continue
                eligible_schemes.append({"id": scheme_id, "name": scheme_row['scheme_name']})
        
        # 4. Store results in the database
        cursor.execute("DELETE FROM schemes WHERE user_id = %s", (user_id,))
        if eligible_schemes:
            insert_query = "INSERT INTO schemes (user_id, scheme_id, scheme_name) VALUES (%s, %s, %s)"
            values = [(user_id, s["id"], s["name"]) for s in eligible_schemes]
            cursor.executemany(insert_query, values)
        conn.commit()

        return {
            "eligible_schemes": eligible_schemes,
            "count": len(eligible_schemes)
        }
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    finally:
        cursor.close()
        conn.close()
