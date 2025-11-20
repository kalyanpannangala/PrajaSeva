# backend/models/chatbot.py
"""
Robust Gemini-backed Chatbot service for PrajaSeva.

Key improvements over the original:
- Do NOT initialize Gemini at import time (avoids missing-secrets at import in HF).
- Initialize on startup with retries and backoff.
- Health endpoint includes connectivity check to Google's generative API host.
- Robust generate handling: normalizes various genai client return shapes.
- Strong server-side logging (tracebacks) while returning safe client-facing errors.
- Uses environment variables (works with HF "Secrets" / .env fallback).
"""

import os
import time
import socket
import traceback
from typing import Optional

from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

# Load local .env if present (HF Spaces: secrets must be set via UI)
load_dotenv()

# Environment / secrets
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
AI_NAME = os.getenv("AI_NAME", "PrajaSeva AI")
JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"

# Global model state
model = None  # set by initialize_gemini()
init_error: Optional[str] = None
_last_init_attempt_ts: Optional[float] = None

# FastAPI app
app = FastAPI(title=f"{AI_NAME} Chatbot API")

# OAuth2 (same as your original)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    """
    Decode JWT and return user id (same behavior as original).
    Raises 401 if invalid.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials"
    )
    if not JWT_SECRET:
        # If JWT_SECRET not set, fail early with 500 so it's visible to ops
        raise HTTPException(status_code=500, detail="Server misconfiguration: JWT_SECRET is not set")

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id: Optional[str] = payload.get("userId")
        if user_id is None:
            raise credentials_exception
        return user_id
    except JWTError:
        raise credentials_exception


def _can_reach_google_api(host: str = "generativelanguage.googleapis.com", port: int = 443, timeout: float = 5.0) -> (bool, Optional[str]):
    """
    Quick socket check to see if we can reach Google's generative language host.
    Returns (reachable, error_string_or_None).
    """
    try:
        sock = socket.create_connection((host, port), timeout=timeout)
        sock.close()
        return True, None
    except Exception as e:
        return False, str(e)


def initialize_gemini(max_retries: int = 3, backoff_seconds: float = 2.0) -> Optional[object]:
    """
    Attempt to configure genai client and instantiate the model.
    Retries on transient errors.

    Returns the model instance on success or None on failure;
    sets module-level `model` and `init_error`.
    """
    global model, init_error, _last_init_attempt_ts
    init_error = None
    model = None
    _last_init_attempt_ts = time.time()

    # Ensure API key present (HF Spaces must set GEMINI_API_KEY as a secret)
    if not GEMINI_API_KEY:
        init_error = "GEMINI_API_KEY not found in environment variables."
        print("Gemini init error:", init_error)
        return None

    # Pre-check network connectivity to Google's endpoint
    ok, net_err = _can_reach_google_api()
    if not ok:
        init_error = f"Network connectivity check failed: {net_err}"
        print("Gemini init error:", init_error)
        return None

    attempt = 0
    while attempt < max_retries:
        attempt += 1
        try:
            # Configure client
            genai.configure(api_key=GEMINI_API_KEY)

            # Instantiate model (wrap for future client differences)
            # Note: using the same model identifier you used previously
            instance = genai.GenerativeModel("gemini-2.5-flash-preview-09-2025")

            # Basic sanity: check instance object
            if instance is None:
                raise RuntimeError("GenAI returned None for model instance")

            model = instance
            init_error = None
            print(f"Gemini model initialized successfully (attempt {attempt}).")
            return model
        except Exception as exc:
            tb = traceback.format_exc()
            print(f"Gemini initialization attempt {attempt} failed: {exc}")
            print(tb)
            init_error = f"Attempt {attempt} failed: {str(exc)}"
            # exponential backoff
            time.sleep(backoff_seconds * attempt)

    # If we reach here, all retries failed
    print("Gemini initialization failed after retries. Last error:", init_error)
    model = None
    return None


@app.on_event("startup")
def on_startup():
    """
    Called when the FastAPI app starts. Attempt to initialize Gemini here.
    """
    print("Chatbot startup: performing network check and initializing Gemini...")
    ok, net_err = _can_reach_google_api()
    if not ok:
        print("Network check failed at startup:", net_err)
    initialize_gemini()
    if init_error:
        print("Gemini init error at startup:", init_error)
    else:
        print("Gemini client ready.")


@app.get("/health")
def health_check():
    """
    Health endpoint that helps debug HF deploy issues:
      - model_initialized: whether Gemini model object exists
      - gemini_key_present: whether GEMINI_API_KEY env var is present
      - init_error: brief init error (safe to show in health)
      - network_check: tries to open connection to Google API host
      - model_object: string form of model (for debug only)
    """
    reachable, net_err = _can_reach_google_api()
    return {
        "model_initialized": model is not None,
        "gemini_key_present": bool(GEMINI_API_KEY),
        "init_error": init_error,
        "network_reachable": reachable,
        "network_error": net_err,
        "model_object": str(model),
    }


def _normalize_genai_response(resp) -> Optional[str]:
    """
    Normalize different genai client response shapes to a plain string.
    Returns text if present otherwise None.
    """
    # common shapes: object with .text or .content; or a dict-like structure
    if resp is None:
        return None

    # If response has .text or .content attributes
    text = getattr(resp, "text", None) or getattr(resp, "content", None)
    if isinstance(text, str) and text.strip():
        return text.strip()

    # If genai returns a dict-like with 'candidates' or 'output' etc.
    try:
        # try dict access
        if isinstance(resp, dict):
            # Many genai responses put text under 'candidates' -> first -> 'content' or 'output'
            cand = resp.get("candidates") or resp.get("outputs") or resp.get("choices")
            if cand and isinstance(cand, (list, tuple)) and len(cand) > 0:
                first = cand[0]
                # possible keys
                for k in ("content", "text", "output", "message"):
                    if isinstance(first, dict) and k in first and isinstance(first[k], str):
                        return first[k].strip()
                # fallback to stringifying first
                return str(first)
            # fallback keys
            for k in ("content", "text", "output"):
                if k in resp and isinstance(resp[k], str):
                    return resp[k].strip()
    except Exception:
        pass

    # If object has .to_dict() or similar
    try:
        d = getattr(resp, "to_dict", lambda: None)()
        if isinstance(d, dict):
            # reuse above logic
            return _normalize_genai_response(d)
    except Exception:
        pass

    # Last resort: string representation if reasonably short
    s = str(resp)
    if s and len(s) < 10000:
        return s

    return None


def chat_with_gemini(question: str) -> str:
    """
    Send the system prompt + user question to the configured Gemini model and return text.
    Raises RuntimeError with safe message if not initialized or on failure.
    """
    global model, init_error

    if model is None:
        # Try a final re-init attempt (useful if startup failed but env changed)
        print("Model is not initialized; attempting a fresh initialize before failing...")
        initialize_gemini()
        if model is None:
            print("Final initialization attempt failed; raising RuntimeError.")
            raise RuntimeError("Gemini model is not initialized. Please check GEMINI_API_KEY and network connectivity (see /health).")

    # Build the system prompt (unchanged core prompt from your original)
    system_prompt = f"""
Your Identity: You are {AI_NAME}, a helpful and knowledgeable assistant for the PrajaSeva platform, specializing in Indian government services and financial planning. Your goal is to provide clear, accurate, and helpful information.

Core Topics of Expertise:
1. Government Schemes: eligibility, benefits, application processes (central & state), scholarships, pensions, housing schemes.
2. Tax Advisory: personal income tax, tax-saving options, ITR filing process, tax slabs, differences between regimes.
3. Wealth & Investment: PPF, NSC, bonds, general investment advice (non-personalized).

IMPORTANT: Tool Redirection Protocol:
- For personal eligibility questions: respond ONLY with:
  "For personalized eligibility, please use the Schemes Recommender tool in PrajaSeva."
- For personalized tax calculations/advice: respond ONLY with:
  "For a detailed calculation and recommendation, please use the Tax Advisory tool in PrajaSeva."
- For personalized investment suggestions: respond ONLY with:
  "To get a personalized investment plan, please use the Wealth Advisory tool in PrajaSeva."

For general informational questions within the expertise, answer directly.
If outside scope, politely decline with: "My expertise is in Indian government schemes and financial advisory. I can't help with that, but I'd be happy to answer any questions you have on those topics."
"""

    full_prompt = f"{system_prompt}\n\nUser Question: {question}"

    try:
        # Prefer using the instantiated model's generate method if available
        # Different genai client versions can expose different APIs (model.generate / model.generate_content, or genai.generate)
        response = None

        # Try common patterns safely
        try:
            # preferred: model.generate_content(prompt)
            if hasattr(model, "generate_content"):
                response = model.generate_content(full_prompt)
            # older/newer clients might have generate() method
            elif hasattr(model, "generate"):
                response = model.generate(full_prompt)
            # fallback to top-level genai.generate (some samples use genai.generate(...))
            elif hasattr(genai, "generate"):
                response = genai.generate(full_prompt)
            else:
                raise RuntimeError("GenAI client does not expose a supported generate method.")
        except Exception as inner_exc:
            # Log and re-raise to outer try/except to handle uniformly
            print("Exception while calling model generate:", inner_exc)
            print(traceback.format_exc())
            raise

        # Normalize response to plain text
        text = _normalize_genai_response(response)
        if text is None:
            # Dump a helpful debug snapshot to logs, then raise safe error
            print("DEBUG: Unexpected Gemini response shape. Raw response printed below:")
            print(repr(response))
            raise RuntimeError("Unexpected Gemini response format from model.")

        return text

    except Exception as e:
        # Log full traceback server-side for diagnostics
        print("Error during Gemini API call:")
        print(traceback.format_exc())
        # Update init_error for health endpoint (non-sensitive summary)
        init_error = f"Runtime error during generation: {str(e)}"
        # Return a safe, user-facing error via exception so FastAPI returns 5xx
        raise RuntimeError("Sorry, I'm having trouble connecting right now.") from e


# Request model
class ChatRequest(BaseModel):
    question: str


@app.post("/chat")
def chat_endpoint(req: ChatRequest, user_id: str = Depends(get_current_user)):
    """
    Chat endpoint: requires auth via get_current_user. Returns the answer or 503 on Gemini failure.
    """
    try:
        answer = chat_with_gemini(req.question)
        return {"answer": answer}
    except RuntimeError as e:
        # RuntimeError messages are safe user-facing messages (we keep them short)
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        # Unexpected exceptions: log and return generic 500
        print("Unexpected error in chat endpoint:")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail="An unexpected server error occurred.")
