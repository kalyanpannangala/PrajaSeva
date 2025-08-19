import pandas as pd
import joblib

def get_user_input():
    age = int(input("Age: "))
    annual_income = int(input("Annual Income: "))
    state = input("State (e.g., Andhra Pradesh or Any): ").strip()
    gender = input("Gender (Male/Female/Any): ").strip()
    caste = input("Caste (General/OBC/SC/ST/Any): ").strip()
    employment_type = input("Employment Type (Student/Farmer/Private-employed/Government-employed/Retired/Self-employed/Un-employed/Any): ").strip()
    disability_status = input("Disability Status (Yes/No/Any): ").strip()
    education_level = input("Education Level (Secondary/Graduate/Postgraduate/Un-educated/Other/Any): ").strip()

    return pd.DataFrame([{
        "age": age,
        "annual_income": annual_income,
        "state": state,
        "gender": gender,
        "caste": caste,
        "employment_type": employment_type,
        "disability_status": disability_status,
        "education_level": education_level
    }])

def field_match(rule_val, user_val):
    """Check if a rule value matches user value or is 'Any'."""
    return str(rule_val).strip().lower() == "any" or str(rule_val).strip().lower() == str(user_val).strip().lower()

def main():
    # Load model and scheme columns
    pipeline = joblib.load("schemes_model.pkl")
    scheme_columns = joblib.load("label_encoder.pkl")  # list of scheme IDs
    rules_df = pd.read_csv("schemes_rules.csv")

    # Get user details
    print("Enter user details:")
    user_data = get_user_input()

    # Predict eligibility
    prediction = pipeline.predict(user_data)[0]  # array of 0/1

    print(f"[DEBUG] Raw Prediction Array: {prediction}")

    eligible_schemes = []
    for scheme_flag, scheme_id in zip(prediction, scheme_columns):
        if scheme_flag == 1:
            scheme_row = rules_df[rules_df["scheme_id"] == scheme_id].iloc[0]

            # Apply SAME 'Any' logic as training
            if str(scheme_row.get("scope", "")).lower() != "central" and scheme_row["state"].upper() != "ALL":
                if not field_match(scheme_row["state"], user_data.iloc[0]["state"]):
                    print(f"[DEBUG] Skipping {scheme_id} (State mismatch: {scheme_row['state']} vs {user_data.iloc[0]['state']})")
                    continue

            if not field_match(scheme_row["allowed_genders"], user_data.iloc[0]["gender"]):
                continue
            if not field_match(scheme_row["allowed_castes"], user_data.iloc[0]["caste"]):
                continue
            if not field_match(scheme_row["allowed_employments"], user_data.iloc[0]["employment_type"]):
                continue
            if not field_match(scheme_row["disability_allowed"], user_data.iloc[0]["disability_status"]):
                continue
            if not field_match(scheme_row["education_levels"], user_data.iloc[0]["education_level"]):
                continue

            eligible_schemes.append(f"{scheme_id}: {scheme_row['scheme_name']}")

    # Output results
    if eligible_schemes:
        print("\nPredicted Eligible Schemes:")
        for scheme in eligible_schemes:
            print(f"- {scheme}")
    else:
        print("\nNo eligible schemes found.")

if __name__ == "__main__":
    main()
