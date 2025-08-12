from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch

# Load model & tokenizer once at startup
MODEL_NAME = "google/flan-t5-small"
print(f"Loading model: {MODEL_NAME}...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)

# Predefined rules
RULES = {
    "government schemes": "I can only answer about government scheme eligibility, tax advisory, or wealth advisory.",
    "tax": "I can provide tax estimation advice based on your input.",
    "wealth": "I can assist with wealth planning."
}

def chatbot_response(user_input: str) -> str:
    """Process input with rules first, then fallback to model."""
    # 1. Check rules
    for keyword, reply in RULES.items():
        if keyword in user_input.lower():
            return reply

    # 2. Fallback to model
    inputs = tokenizer(user_input, return_tensors="pt")
    with torch.no_grad():
        outputs = model.generate(**inputs, max_length=100)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)
