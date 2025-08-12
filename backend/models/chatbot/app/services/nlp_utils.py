# nlp_utils.py
import re
from difflib import SequenceMatcher

TOPIC_KEYWORDS = {
    "schemes": [
        "scheme", "schemes", "eligib", "apply", "benefit",
        "pension", "scholarship", "student", "education",
        "post matric", "pre matric", "tuition", "stipend"
    ],
    "tax": [
        "tax", "regime", "deduct", "80c", "80d", "hra",
        "itr", "slab", "refund"
    ],
    "wealth": [
        "sip", "retire", "corpus", "ppf", "nps",
        "investment", "savings", "returns", "step-up", "rd", "fd"
    ]
}

INDIAN_STATES = [
    "andhra pradesh", "telangana", "karnataka", "tamil nadu",
    "kerala", "maharashtra", "bihar", "uttar pradesh",
    "west bengal", "assam", "odisha", "rajasthan", "gujarat",
    "delhi", "chhattisgarh", "goa", "jharkhand", "himachal pradesh",
    "uttarakhand", "manipur", "meghalaya", "mizoram", "nagaland",
    "sikkim", "tripura"
]

def _clean(text):
    return re.sub(r"[^\w\s]", " ", text.lower())

def detect_domain(text):
    """
    Return 'schemes'|'tax'|'wealth'|None
    """
    t = _clean(text)
    counts = {k: sum(1 for kw in kws if kw in t) for k, kws in TOPIC_KEYWORDS.items()}
    top = max(counts, key=counts.get)
    if counts[top] > 0:
        return top

    # fallback: token fuzzy match (handle typos)
    tokens = t.split()
    for k, kws in TOPIC_KEYWORDS.items():
        for tok in tokens:
            for kw in kws:
                if SequenceMatcher(None, tok, kw).ratio() > 0.85:
                    return k
    return None

def extract_state(text):
    t = _clean(text)
    # exact substring match first
    for s in INDIAN_STATES:
        if s in t:
            return s.title()
    # fuzzy fallback
    tokens = t.split()
    for s in INDIAN_STATES:
        for tok in tokens:
            if SequenceMatcher(None, tok, s.split()[0]).ratio() > 0.85:
                return s.title()
    return None

def mentions_student(text):
    t = _clean(text)
    return any(w in t for w in ["student", "students", "scholarship", "studentloan", "education"])
