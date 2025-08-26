# backend/models/chatbot.py
import os
from fastapi import FastAPI, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
from typing import List
from fastapi.security import OAuth2PasswordBearer

# Load environment variables from a .env file
load_dotenv() # Correctly loads from the root .env file
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
AI_NAME = os.getenv("AI_NAME", "PrajaSeva AI")
JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"


# Configure the Gemini API
model = None
if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-1.5-flash")
    except Exception as e:
        print(f"Error configuring Gemini API: {e}")
else:
    print("GEMINI_API_KEY not found in environment variables.")

# FastAPI app for the chatbot service
app = FastAPI(title=f"{AI_NAME} Chatbot API")

# --- Security & Authentication ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
from jose import JWTError, jwt

def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id: str = payload.get("userId")
        if user_id is None: raise credentials_exception
        return user_id
    except JWTError:
        raise credentials_exception


def chat_with_gemini(question: str) -> str:
    """
    Sends a question to the Gemini model with a detailed system prompt to act as a specialized assistant.
    """
    if not model:
        raise RuntimeError("Gemini model is not initialized. Check your API key.")

    # --- The New, Smarter and More Flexible System Prompt ---
    system_prompt = f"""
    Your Identity: You are {AI_NAME}, a helpful and knowledgeable assistant for the PrajaSeva platform, specializing in Indian government services and financial planning. Your goal is to provide clear, accurate, and helpful information.

    Core Topics of Expertise:
    Your primary function is to answer informational questions related to these areas. Be helpful and answer if the question is even tangentially related to these topics.
    1.  Government Schemes: Answer questions about eligibility criteria, benefits, and application processes for central and state schemes. This includes specific types like scholarships, fee reimbursements (like RTF/MTF), pensions, and housing schemes.
    2.  Tax Advisory: Answer questions about personal income tax, tax-saving options, the process of filing ITR, different tax slabs, and the differences between tax regimes.
    3.  Wealth and Investment Advisory: Answer questions about government investment plans (PPF, NSC, etc.), bonds, and provide general advice on financial topics like home loans, education loans, and savings strategies.

    --- IMPORTANT: Tool Redirection Protocol ---
    Your MOST IMPORTANT task is to identify when a user's question requires a personalized calculation that can only be provided by PrajaSeva's specialized tools. When you detect such a question, you MUST NOT try to answer it yourself. Instead, you MUST respond with ONLY ONE of the following exact phrases:

    1.  If the user asks about their personal ELIGIBILITY for a specific scheme (e.g., "Am I eligible for Sukanya Samriddhi Yojana?", "Can I apply for PM-Kisan?"), you MUST respond with:
        "For personalized eligibility, please use the Schemes Recommender tool in PrajaSeva."

    2.  If the user asks for a personalized TAX CALCULATION or advice on which tax regime is better FOR THEM (e.g., "Which tax regime is better for me?", "Calculate my tax for an 8 lakh salary"), you MUST respond with:
        "For a detailed calculation and recommendation, please use the Tax Advisory tool in PrajaSeva."

    3.  If the user asks for a personalized INVESTMENT SUGGESTION or wealth plan (e.g., "Suggest a low-risk investment plan for me.", "How should I invest Rs 50,000 for my child?"), you MUST respond with:
        "To get a personalized investment plan, please use the Wealth Advisory tool in PrajaSeva."

    For all other general informational questions within your core topics (e.g., "What is RTF and MTF?", "What are the steps to file ITR?", "What are common difficulties in getting a home loan?"), you should answer them directly and helpfully.

    Refusal Protocol:
    If a question is completely unrelated to Indian finance, government schemes, or public services (e.g., "Write a poem about the moon", "What is the capital of France?"), politely decline by saying: "My expertise is in Indian government schemes and financial advisory. I can't help with that, but I'd be happy to answer any questions you have on those topics."
    """

    full_prompt = f"{system_prompt}\n\nUser Question: {question}"

    try:
        response = model.generate_content(full_prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error during Gemini API call: {e}")
        return "Sorry, I encountered an error while processing your request."

# Pydantic model for the request body
class ChatRequest(BaseModel):
    question: str

# HTTP endpoint for single-question interactions
@app.post("/chat")
def chat_endpoint(req: ChatRequest, user_id: str = Depends(get_current_user)):
    """Chat endpoint that receives a question and returns the Gemini bot's answer."""
    try:
        answer = chat_with_gemini(req.question)
        return {"answer": answer}
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")
