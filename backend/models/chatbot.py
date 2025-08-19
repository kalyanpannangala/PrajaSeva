import os
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
from typing import List

# Load environment variables from a .env file
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
AI_NAME = os.getenv("AI_NAME", "PrajaSeva AI")

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

def chat_with_gemini(question: str) -> str:
    """
    Sends a question to the Gemini model with a detailed system prompt to act as a specialized assistant.
    """
    if not model:
        raise RuntimeError("Gemini model is not initialized. Check your API key.")

    # --- The New, Smarter System Prompt ---
    system_prompt = f"""
    Your Identity: You are {AI_NAME}, a helpful and knowledgeable assistant for the PrajaSeva platform. Your primary role is to provide clear, accurate information about Indian government services and financial planning, and to guide users to the correct tools within the PrajaSeva application.

    Core Topics of Expertise:
    Your primary function is to answer informational questions related to:
    1. Government Schemes: General details, benefits, and application processes.
    2. Tax Advisory: General information about personal income tax, tax-saving options, and tax rules.
    3. Wealth and Investment Advisory: General details about government investment plans (PPF, NSC, etc.).

    --- IMPORTANT: Tool Redirection Protocol ---
    Your MOST IMPORTANT task is to identify when a user's question requires personalized analysis that can only be provided by PrajaSeva's specialized tools. When you detect such a question, you MUST NOT try to answer it yourself. Instead, you MUST respond with ONLY ONE of the following exact phrases:

    1.  If the user asks about their personal ELIGIBILITY for a specific scheme (e.g., "Am I eligible for Sukanya Samriddhi Yojana?", "Can I apply for PM-Kisan?"), you MUST respond with:
        "For personalized eligibility, please use the Schemes Recommender tool in PrajaSeva."

    2.  If the user asks for a personalized TAX CALCULATION or advice on which tax regime is better for them (e.g., "Which tax regime is better for me?", "Calculate my tax for an 8 lakh salary"), you MUST respond with:
        "For a detailed calculation and recommendation, please use the Tax Advisory tool in PrajaSeva."

    3.  If the user asks for a personalized INVESTMENT SUGGESTION or wealth plan (e.g., "Suggest a low-risk investment plan.", "How should I invest Rs 50,000 for my child?"), you MUST respond with:
        "To get a personalized investment plan, please use the Wealth Advisory tool in PrajaSeva."

    For all other general informational questions within your core topics (e.g., "What is the interest rate of PPF?", "What documents are needed for PM Awas Yojana?"), you should answer them directly and helpfully.

    Out-of-Scope Topics:
    Do NOT answer questions clearly unrelated to Indian government schemes or financial advisory (e.g., general knowledge, creative writing, harmful queries).

    Refusal Protocol:
    If a question is definitively out-of-scope, politely decline by saying: "My expertise is in Indian government schemes and financial advisory. I can't help with that, but I'd be happy to answer any questions you have on those topics."
    """

    # Combine the system prompt and the user's question for the model
    full_prompt = f"{system_prompt}\n\nUser Question: {question}"

    try:
        response = model.generate_content(full_prompt)
        return response.text.strip()
    except Exception as e:
        # Handle potential API errors gracefully
        print(f"Error during Gemini API call: {e}")
        return "Sorry, I encountered an error while processing your request."

# Pydantic model for the request body of the HTTP endpoint
class ChatRequest(BaseModel):
    question: str

# HTTP endpoint for single-question interactions
@app.post("/chat")
def chat_endpoint(req: ChatRequest):
    """Chat endpoint that receives a question and returns the Gemini bot's answer."""
    try:
        answer = chat_with_gemini(req.question)
        return {"answer": answer}
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e)) # Service Unavailable
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

# WebSocket endpoint for interactive chat sessions
@app.websocket("/ws/{user_name}")
async def websocket_endpoint(websocket: WebSocket, user_name: str):
    await websocket.accept()
    
    # --- Send the initial greeting message ---
    greeting_message = (
        f"Hello {user_name}, I am {AI_NAME}. How can I help you today?"
    )
    await websocket.send_text(greeting_message)

    try:
        while True:
            # Wait for a question from the user
            question = await websocket.receive_text()
            
            # Get the answer from the Gemini model
            answer = chat_with_gemini(question)
            
            # Send the answer back to the user
            await websocket.send_text(answer)
    except WebSocketDisconnect:
        print(f"Client {user_name} disconnected.")
    except Exception as e:
        print(f"An error occurred in the websocket: {e}")
        await websocket.send_text("Sorry, an error occurred. Please try reconnecting.")

if __name__ == "__main__":
    import uvicorn
    # This allows running the API directly for testing
    uvicorn.run(app, host="0.0.0.0", port=8000)
