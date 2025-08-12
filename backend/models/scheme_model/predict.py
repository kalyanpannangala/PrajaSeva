import pandas as pd
import joblib

def get_user_input():
    age = int(input("Age: "))
    annual_income = int(input("Annual Income: "))
    state = input("State (e.g., Andhra Pradesh or Any): ").strip()
    gender = input("Gender (Male/Female/Any): ").strip()
    caste = input("Caste (General/OBC/SC/ST/Any): ").strip()
    employment_type = input("Employment Type (Farmer/Private-employed/Government-employed/Retired/Self-employed/Any): ").strip()
    disability_status = input("Disability Status (Yes/No/Any): ").strip()
    education_level = input("Education Level (Graduate/Postgraduate/Other/Any): ").strip()

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

def main():
    # Load model and scheme columns
    pipeline = joblib.load("scheme_model.pkl")
    scheme_columns = joblib.load("label_encoder.pkl")  # now just a list of scheme IDs
    rules_df = pd.read_csv("schemes_rules.csv")

    # Get user details
    print("Enter user details:")
    user_data = get_user_input()

    # Predict eligibility
    prediction = pipeline.predict(user_data)[0]  # array of 0/1 values

    eligible_schemes = []
    for scheme_flag, scheme_id in zip(prediction, scheme_columns):
        if scheme_flag == 1:
            scheme_row = rules_df[rules_df["scheme_id"] == scheme_id].iloc[0]

            # HARD FILTER: State-specific check
            if scheme_row["scope"].lower() == "state":
                if user_data.iloc[0]["state"].lower() != scheme_row["state"].lower() and user_data.iloc[0]["state"].lower() != "any":
                    continue  # skip if mismatch

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
