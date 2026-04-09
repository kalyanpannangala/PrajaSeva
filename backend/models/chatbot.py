# backend/models/chatbot.py

import os
import json
import traceback
import requests
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

# ---------------- ENV ----------------
BASE_DIR = Path(__file__).resolve().parent


def _load_env_files() -> None:
    """Load env files from common backend locations without overriding OS env vars."""
    candidate_files = [
        BASE_DIR / ".env.local",
        BASE_DIR.parent / ".env.local",
        BASE_DIR.parent / ".env",
        BASE_DIR.parent.parent / ".env.local",
        BASE_DIR.parent.parent / ".env",
    ]
    for env_file in candidate_files:
        if env_file.exists():
            load_dotenv(env_file, override=False)


def _normalize_openrouter_key(raw_key: Optional[str]) -> Optional[str]:
    if not raw_key:
        return None

    key = raw_key.strip().strip("\"'")
    if key.lower().startswith("bearer "):
        key = key[7:].strip()
    return key or None


_load_env_files()

OPENROUTER_API_KEY = _normalize_openrouter_key(os.getenv("OPENROUTER_API_KEY"))
AI_NAME = os.getenv("AI_NAME", "PrajaSeva AI")
JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"

# ---------------- GLOBAL ----------------
init_error: Optional[str] = None

# ---------------- APP ----------------
app = FastAPI(title=f"{AI_NAME} Chatbot API")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# ---------------- AUTH ----------------
def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials"
    )

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id: Optional[str] = payload.get("userId")
        if user_id is None:
            raise credentials_exception
        return user_id
    except JWTError:
        raise credentials_exception


# ---------------- HEALTH ----------------
@app.get("/health")
def health():
    return {
        "api_key_present": bool(OPENROUTER_API_KEY),
        "api_key_has_bearer_prefix": bool(
            os.getenv("OPENROUTER_API_KEY", "").strip().lower().startswith("bearer ")
        ),
        "init_error": init_error
    }


# ---------------- SYSTEM PROMPT ----------------
def get_system_prompt():
    return f"""
Your Identity:
You are {AI_NAME}, a helpful and knowledgeable assistant for the PrajaSeva platform.

Your goal is to provide clear, accurate, and helpful information related to Indian government services and financial planning.

-------------------------------------

Core Topics of Expertise:

1. Government Schemes:
- Eligibility criteria
- Benefits
- Application process
- Scholarships, pensions, housing schemes

2. Tax Advisory:
- Income tax basics
- Tax-saving options
- Filing ITR
- Tax regimes comparison

3. Wealth & Investment:
- PPF, NSC, bonds
- Savings strategies
- Loans (home, education)
- General financial planning

-------------------------------------

🚨 IMPORTANT: TOOL REDIRECTION RULES (STRICT)

If the user asks for PERSONALIZED help, DO NOT answer directly.

Instead, reply EXACTLY with:

1. Scheme eligibility:
"For personalized eligibility, please use the Schemes Recommender tool in PrajaSeva."

2. Tax calculation / best regime:
"For a detailed calculation and recommendation, please use the Tax Advisory tool in PrajaSeva."

3. Investment planning:
"To get a personalized investment plan, please use the Wealth Advisory tool in PrajaSeva."

-------------------------------------

✅ GENERAL QUESTIONS:

If the question is general (not personal), answer clearly and helpfully.

-------------------------------------

❌ REFUSAL RULE:

If the question is NOT related to:
- Indian government schemes
- Finance
- Tax
- Public services

Respond with:

"My expertise is in Indian government schemes and financial advisory. I can't help with that, but I'd be happy to answer any questions you have on those topics."
"""


# ---------------- CHAT FUNCTION ----------------
def chat_with_openrouter(question: str) -> str:
    global init_error

    if not OPENROUTER_API_KEY:
        raise RuntimeError("Missing OpenRouter API key")

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "mistralai/mixtral-8x7b-instruct",
                "messages": [
                    {"role": "system", "content": get_system_prompt()},
                    {"role": "user", "content": question}
                ]
            },
            timeout=20
        )

        # Debug logs (very important for HF)
        print("STATUS:", response.status_code)
        print("RAW RESPONSE:", response.text)

        if response.status_code != 200:
            error_detail = response.text
            try:
                parsed = response.json()
                error_detail = parsed.get("error", {}).get("message", response.text)
            except json.JSONDecodeError:
                pass

            if response.status_code == 401:
                raise RuntimeError(
                    "OpenRouter authentication failed (401). "
                    "Check OPENROUTER_API_KEY in your backend env; it should be a valid "
                    "OpenRouter key without a leading 'Bearer '. "
                    f"Provider message: {error_detail}"
                )

            raise RuntimeError(f"OpenRouter request failed ({response.status_code}): {error_detail}")

        data = response.json()

        return data["choices"][0]["message"]["content"]

    except RuntimeError as e:
        print("❌ OpenRouter error:")
        print(traceback.format_exc())
        init_error = str(e)
        raise
    except Exception as e:
        print("❌ OpenRouter error:")
        print(traceback.format_exc())
        init_error = str(e)
        raise RuntimeError("Sorry, I'm having trouble connecting right now.")


# ---------------- REQUEST MODEL ----------------
class ChatRequest(BaseModel):
    question: str


# ---------------- API ----------------
@app.post("/chat")
def chat_endpoint(req: ChatRequest, user_id: str = Depends(get_current_user)):
    try:
        answer = chat_with_openrouter(req.question)
        return {"answer": answer}
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Unexpected server error")