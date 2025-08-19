# api.py  (Schemes Model API)
from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib
from pathlib import Path

app = FastAPI(title="Schemes Eligibility API")

# -------- Load model & data once at startup --------
base_dir = Path(__file__).resolve().parent
pipeline = joblib.load(base_dir / "schemes_model.pkl")
scheme_columns = joblib.load(base_dir / "label_encoder.pkl")  # list of scheme IDs
rules_df = pd.read_csv(base_dir / "schemes_rules.csv")


# -------- Request schema --------
class SchemeRequest(BaseModel):
    age: int
    annual_income: int
    state: str
    gender: str
    caste: str
    employment_type: str
    disability_status: str
    education_level: str


# -------- API Endpoint --------
@app.post("/predict")
def predict_schemes(req: SchemeRequest):
    # Convert input to DataFrame
    user_data = pd.DataFrame([{
        "age": req.age,
        "annual_income": req.annual_income,
        "state": req.state.strip(),
        "gender": req.gender.strip(),
        "caste": req.caste.strip(),
        "employment_type": req.employment_type.strip(),
        "disability_status": req.disability_status.strip(),
        "education_level": req.education_level.strip()
    }])

    # Predict eligibility
    prediction = pipeline.predict(user_data)[0]  # array of 0/1 values

    eligible_schemes = []
    for scheme_flag, scheme_id in zip(prediction, scheme_columns):
        if scheme_flag == 1:
            scheme_row = rules_df[rules_df["scheme_id"] == scheme_id].iloc[0]

            # HARD FILTER: State-specific check
            if scheme_row["scope"].lower() == "state":
                if (
                    user_data.iloc[0]["state"].lower()
                    != scheme_row["state"].lower()
                    and user_data.iloc[0]["state"].lower() != "any"
                ):
                    continue  # skip if mismatch

            eligible_schemes.append(f"{scheme_id}: {scheme_row['scheme_name']}")

    return {
        "eligible_schemes": eligible_schemes,
        "count": len(eligible_schemes)
    }
