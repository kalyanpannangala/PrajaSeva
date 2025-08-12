from fastapi import FastAPI
from pydantic import BaseModel
from chatbot import chatbot_response

app = FastAPI(title="PrajaSeva AI", version="1.0")

class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str

@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(req: ChatRequest):
    answer = chatbot_response(req.question)
    return ChatResponse(answer=answer)

@app.get("/")
def root():
    return {"message": "PrajaSeva Chatbot is running"}
