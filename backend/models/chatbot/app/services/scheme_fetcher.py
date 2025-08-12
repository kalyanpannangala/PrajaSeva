# scheme_fetcher.py
import pandas as pd
from pathlib import Path

SCHEMES_CSV = Path(__file__).resolve().parent.joinpath("schemes_rules.csv")

def load_schemes():
    df = pd.read_csv(SCHEMES_CSV, dtype=str).fillna("")
    # normalize lowercase columns to ease matching
    df["scope"] = df["scope"].str.lower()
    df["state_norm"] = df["state"].str.lower()
    df["allowed_employments_norm"] = df["allowed_employments"].str.lower()
    df["allowed_genders_norm"] = df["allowed_genders"].str.lower()
    df["allowed_castes_norm"] = df["allowed_castes"].str.lower()
    return df

def schemes_for_students(state=None):
    """
    Return list of schemes (dicts) applicable to students in given state.
    If state is None, return only central schemes that match students.
    """
    df = load_schemes()
    # central or state-specific for the same state
    if state:
        state_norm = state.lower()
        mask_state = ((df["scope"] == "central") | ((df["scope"] == "state") & (df["state_norm"] == state_norm)))
    else:
        mask_state = (df["scope"] == "central")
    # employment column may contain comma-separated values; check student keyword
    mask_student = df["allowed_employments_norm"].str.contains("student", na=False) | df["description"].str.lower().str.contains("student", na=False)
    result = df[mask_state & mask_student]
    # return ids + names + a short rule summary
    out = []
    for _, r in result.iterrows():
        out.append({
            "scheme_id": r["scheme_id"],
            "scheme_name": r["scheme_name"],
            "scope": r["scope"],
            "state": r["state"],
            "age_min": r.get("age_min", ""),
            "age_max": r.get("age_max", ""),
            "income_min": r.get("annual_income_min", ""),
            "income_max": r.get("annual_income_max", ""),
            "notes": r.get("description", "")
        })
    return out
