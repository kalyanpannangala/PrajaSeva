import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai

# Load env variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
AI_NAME = os.getenv("AI_NAME", "Assistant")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not found in .env file")

# Configure Gemini API
genai.configure(api_key=GEMINI_API_KEY)

# Create model instance
model = genai.GenerativeModel("gemini-2.5-flash")

# FastAPI app
app = FastAPI(title=f"{AI_NAME} API")

# Request model
class ChatRequest(BaseModel):
    question: str

@app.post("/chat")
def chat(req: ChatRequest):
    """
    Chat endpoint that enforces restricted replies.
    """
    try:
        rules_prompt = f"""
        You are {AI_NAME}, an AI assistant for PrajaSeva platform.
        You must only answer questions related to:
        1. Government scheme eligibility.
        2. Tax advisory.
        3. Wealth advisory.
        If the question is outside these topics, respond exactly with:
        "I can only answer about government scheme eligibility, tax advisory, or wealth advisory."

        Question: {req.question}
        """

        response = model.generate_content(rules_prompt)
        return {"answer": response.text.strip()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
