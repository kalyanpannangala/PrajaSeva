import pandas as pd
import json
import os
import sys

def format_eligibility(scheme):
    """Converts the rules from a CSV row into a human-readable list of eligibility criteria."""
    criteria = []
    # State
    if str(scheme.get('state', 'any')).strip().lower() != 'any':
        criteria.append(f"Applicant must be a resident of {scheme['state']}.")
    # Age
    try:
        age_min = int(scheme.get('age_min', 0))
        age_max = int(scheme.get('age_max', 120))
        if age_max < 120:
            criteria.append(f"Applicant's age must be between {age_min} and {age_max} years.")
    except (ValueError, TypeError): pass
    # Income
    try:
        income_max = int(scheme.get('annual_income_max', 10**9))
        if income_max < 10**9:
            criteria.append(f"Annual family income must not exceed ₹{income_max:,}.")
    except (ValueError, TypeError): pass
    # Caste
    if str(scheme.get('allowed_castes', 'any')).strip().lower() != 'any':
        criteria.append(f"Applicant must belong to one of the following communities: {scheme['allowed_castes']}.")
    # Gender
    if str(scheme.get('allowed_genders', 'any')).strip().lower() != 'any':
        criteria.append(f"This scheme is available for: {scheme['allowed_genders']}.")
    # Employment
    if str(scheme.get('allowed_employments', 'any')).strip().lower() != 'any':
        criteria.append(f"Applicant's employment status must be one of the following: {scheme['allowed_employments']}.")
    # Disability
    if str(scheme.get('disability_allowed', 'any')).strip().lower() == 'yes':
        criteria.append("This scheme is specifically for persons with disabilities.")
    # Education
    if str(scheme.get('education_levels', 'any')).strip().lower() != 'any':
         criteria.append(f"Required education level: {scheme['education_levels']}.")
    return criteria if criteria else ["General eligibility criteria apply."]

def create_details_file():
    """Reads schemes_rules.csv and generates the detailed scheme_details.json file without using any external APIs."""
    print("Starting generation of scheme_details.json from CSV...")

    try:
        rules_path = os.path.join(os.path.dirname(__file__), 'schemes_rules.csv')
        rules_df = pd.read_csv(rules_path, dtype=str).fillna('')
        rules_df.columns = rules_df.columns.str.strip()
        print(f"Successfully loaded {len(rules_df)} schemes from schemes_rules.csv.")
    except FileNotFoundError:
        print(f"ERROR: Could not find schemes_rules.csv at {rules_path}")
        sys.exit()

    all_scheme_details = []

    for index, scheme_rule in rules_df.iterrows():
        objective_text = str(scheme_rule.get('notes', '')) if pd.notna(scheme_rule.get('notes')) else "Details about the scheme's objectives."
        state_name = "Central Government" if str(scheme_rule.get('state', 'any')).strip().lower() == 'any' else str(scheme_rule['state'])
        
        final_details = {
            "scheme_id": str(scheme_rule['scheme_id']).strip(),
            "scheme_name": str(scheme_rule['scheme_name']).strip(),
            "state": state_name,
            "issuing_authority": "To be updated.",
            "objective": objective_text.strip(),
            "benefits_summary": "To be updated.",
            "benefits_list": ["To be updated."],
            "eligibility_criteria": format_eligibility(scheme_rule),
            "how_to_apply": "To be updated.",
            "required_documents": ["To be updated."],
            "official_link": "To be updated."
        }
        all_scheme_details.append(final_details)

    output_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data')
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'scheme_details.json')
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(all_scheme_details, f, indent=2)

    print("\n-------------------------------------------------------------")
    print(f"✅ SUCCESS: Generated scheme_details.json with {len(all_scheme_details)} schemes.")
    print(f"File saved at: {output_path}")
    print("-------------------------------------------------------------")

if __name__ == "__main__":
    create_details_file()

