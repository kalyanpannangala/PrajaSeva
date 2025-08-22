# schemes_model/api.py
import os
import asyncio
import json
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import pandas as pd
import joblib
from pathlib import Path
import psycopg2
from psycopg2.extras import DictCursor
from jose import JWTError, jwt
from dotenv import load_dotenv

# --- Environment Setup ---
load_dotenv(".env.local")
DATABASE_URL = os.getenv("DATABASE_URL")
JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"

app = FastAPI(title="Schemes Eligibility API")

# --- Security & Authentication ---
def get_token(request: Request) -> str:
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header.split(" ")[1]
    
    token = request.query_params.get("token")
    if token:
        return token
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated",
    )

def get_current_user(token: str = Depends(get_token)) -> str:
    """Decodes the JWT to get the user_id."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id: str = payload.get("userId")
        if user_id is None:
            raise credentials_exception
        return user_id
    except JWTError:
        raise credentials_exception

# --- Database Connection ---
def get_db_connection():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        raise HTTPException(status_code=500, detail="Database connection failed.")

# --- Load ML Model & Data ---
base_dir = Path(__file__).resolve().parent
pipeline = joblib.load(base_dir / "schemes_model.pkl")
scheme_columns = joblib.load(base_dir / "label_encoder.pkl")
rules_df = pd.read_csv(base_dir / "schemes_rules.csv")

# --- Async Generator for Streaming Process Updates ---
async def run_prediction_process(user_id: str):
    """
    This generator function yields status updates at each step of the process.
    """
    conn = None
    try:
        # Step 1: Fetching Data
        yield f"data: {json.dumps({'status': 'Step 1: Fetching your profile from the database...'})}\n\n"
        await asyncio.sleep(0.5)
        
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=DictCursor)
        cursor.execute("SELECT * FROM schemes_input WHERE user_id = %s ORDER BY created_at DESC LIMIT 1", (user_id,))
        user_input_data = cursor.fetchone()

        if not user_input_data:
            raise HTTPException(status_code=404, detail="No setup data found for this user.")

        # Step 2: Running Prediction Model
        yield f"data: {json.dumps({'status': 'Step 2: Running analysis with the PrajaSeva AI model...'})}\n\n"
        await asyncio.sleep(1)

        user_data = pd.DataFrame([dict(user_input_data)])
        user_data.rename(columns={'income': 'annual_income'}, inplace=True)
        user_data['disability_status'] = user_data['disability_status'].apply(lambda x: "Yes" if x else "No")
        prediction = pipeline.predict(user_data)[0]

        # Step 3: Filtering Results
        yield f"data: {json.dumps({'status': 'Step 3: Filtering and validating eligible schemes...'})}\n\n"
        await asyncio.sleep(0.5)

        eligible_schemes = []
        for scheme_flag, scheme_id in zip(prediction, scheme_columns):
            if scheme_flag == 1:
                scheme_row = rules_df[rules_df["scheme_id"] == scheme_id].iloc[0]
                if scheme_row["scope"].lower() == "state" and user_data.iloc[0]["state"].lower() != scheme_row["state"].lower():
                    continue
                eligible_schemes.append({"id": scheme_id, "name": scheme_row['scheme_name']})
        
        # Step 4: Saving Results
        yield f"data: {json.dumps({'status': 'Step 4: Saving your personalized results...'})}\n\n"
        await asyncio.sleep(0.5)

        cursor.execute("DELETE FROM schemes WHERE user_id = %s", (user_id,))
        if eligible_schemes:
            insert_query = "INSERT INTO schemes (user_id, scheme_id, scheme_name) VALUES (%s, %s, %s)"
            values_to_insert = [(user_id, scheme["id"], scheme["name"]) for scheme in eligible_schemes]
            cursor.executemany(insert_query, values_to_insert)
        conn.commit()

        # Final Step: Send the complete JSON payload
        final_payload = {"result": {"eligible_schemes": eligible_schemes, "count": len(eligible_schemes)}}
        yield f"data: {json.dumps(final_payload)}\n\n"

    except Exception as e:
        if conn: conn.rollback()
        error_payload = {"error": f"An error occurred: {str(e)}"}
        yield f"data: {json.dumps(error_payload)}\n\n"
    finally:
        if conn:
            cursor.close()
            conn.close()

# --- API Endpoint ---
# --- FIX: Changed from @app.post to @app.get ---
@app.get("/predict")
async def predict_schemes_stream(user_id: str = Depends(get_current_user)):
    return StreamingResponse(run_prediction_process(user_id), media_type="text/event-stream")
