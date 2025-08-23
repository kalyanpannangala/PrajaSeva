from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# --- FIX: Changed to relative imports with a leading dot (.) ---
# This tells Python to look for these folders in the same directory as main.py
from .schemes_model.api import app as schemes_app
from .tax_model.api import app as tax_app
from .wealth_model.api import app as wealth_app
from .chatbot import app as chatbot_app

# ---------------------- MAIN APP ----------------------
app = FastAPI(title="PrajaSeva AI Platform")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to frontend URL in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------- MOUNT ALL SERVICES ----------------------
app.mount("/schemes", schemes_app)
app.mount("/tax", tax_app)
app.mount("/wealth", wealth_app)
app.mount("/chat", chatbot_app)

# ---------------------- ROOT ENDPOINT ----------------------
@app.get("/")
def root():
    return {
        "message": "Welcome to PrajaSeva AI Backend",
        "services": {
            "Schemes API": "/schemes/docs",
            "Tax API": "/tax/docs",
            "Wealth API": "/wealth/docs",
            "Chatbot API": "/chat/docs"
        }
    }

# ---------------------- START SERVER ----------------------
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
