import pandas as pd
import random
import sys

print("Starting dataset generation...")

# Load rules
try:
    rules = pd.read_csv("schemes_rules.csv")
    print("Successfully loaded schemes_rules.csv")
except FileNotFoundError:
    print("Error: schemes_rules.csv not found. Please make sure the file is in the correct directory.")
    sys.exit()


# --- Data Cleaning and Preprocessing ---
# Replace "Any" or missing values with default numbers for reliable comparison
rules["age_min"] = pd.to_numeric(rules["age_min"], errors="coerce").fillna(0).astype(int)
rules["age_max"] = pd.to_numeric(rules["age_max"], errors="coerce").fillna(120).astype(int) # Increased max age for safety
rules["annual_income_min"] = pd.to_numeric(rules["annual_income_min"], errors="coerce").fillna(0).astype(int)
rules["annual_income_max"] = pd.to_numeric(rules["annual_income_max"], errors="coerce").fillna(10**9).astype(int)
# Ensure all 'allowed' columns are strings to prevent errors
for col in ['allowed_genders', 'allowed_castes', 'allowed_employments', 'disability_allowed', 'education_levels']:
    rules[col] = rules[col].astype(str)

# --- Define Valid User Profile Options (CORRECTED) ---
# These lists should ONLY contain actual values a user can have, never "Any".
VALID_STATES = list(set(rules[rules["state"] != "Any"]["state"].unique()))
VALID_GENDERS = ["Male", "Female", "Other"]
VALID_CASTES = ["General", "OBC", "SC", "ST"]
VALID_EMPLOYMENTS = ["Student", "Farmer", "Private-employed", "Government-employed", "Retired", "Self-employed", "Un-employed"]
VALID_DISABILITIES = ["Yes", "No"]
VALID_EDUCATIONS = ["Un-educated", "Secondary", "Graduate", "Postgraduate", "Other"]

# --- Eligibility Checking Function (Unchanged from your logic) ---
def is_eligible(user, rule):
    # Helper function to check if a user's attribute matches a rule's requirement.
    # A match occurs if the rule is "Any" or if the user's value is in the rule's allowed values.
    def match(rule_values, user_value):
        rule_values_str = str(rule_values).strip().lower()
        user_value_str = str(user_value).strip().lower()
        if rule_values_str == "any":
            return True
        # Check if the user value is one of the comma-separated values in the rule
        return user_value_str in [val.strip().lower() for val in rule_values_str.split(',')]

    # Rule checks
    if rule["state"] != "Any" and str(rule["state"]).strip().lower() != str(user["state"]).strip().lower():
        return False
    if not (rule["age_min"] <= user["age"] <= rule["age_max"]):
        return False
    if not (rule["annual_income_min"] <= user["annual_income"] <= rule["annual_income_max"]):
        return False
    if not match(rule["allowed_genders"], user["gender"]):
        return False
    if not match(rule["allowed_castes"], user["caste"]):
        return False
    if not match(rule["allowed_employments"], user["employment_type"]):
        return False
    if not match(rule["disability_allowed"], user["disability_status"]):
        return False
    if not match(rule["education_levels"], user["education_level"]):
        return False
    return True

# --- Balanced Dataset Generation ---
data = []
labels = []
samples_per_scheme = 100 # Increased samples for better training
max_attempts = samples_per_scheme * 20

print(f"Generating {samples_per_scheme} samples for each of the {len(rules)} schemes...")

for index, rule in rules.iterrows():
    scheme_id = rule["scheme_id"]

    # --- Generate Positive Samples (GUARANTEED ELIGIBLE) ---
    pos_count = 0
    attempts = 0
    while pos_count < samples_per_scheme // 2 and attempts < max_attempts:
        attempts += 1
        
        # FIX: Correctly choose ONE valid option from multi-value rules (e.g., 'SC,ST' -> 'SC' or 'ST')
        # FIX: Correctly choose a random valid user option when the rule is 'Any'
        user = {
            "age": random.randint(rule["age_min"], rule["age_max"]),
            "annual_income": random.randint(rule["annual_income_min"], rule["annual_income_max"]),
            "state": rule["state"] if rule["state"] != "Any" else random.choice(VALID_STATES),
            "gender": random.choice(rule["allowed_genders"].split(',')) if rule["allowed_genders"].lower() != "any" else random.choice(VALID_GENDERS),
            "caste": random.choice(rule["allowed_castes"].split(',')) if rule["allowed_castes"].lower() != "any" else random.choice(VALID_CASTES),
            "employment_type": random.choice(rule["allowed_employments"].split(',')) if rule["allowed_employments"].lower() != "any" else random.choice(VALID_EMPLOYMENTS),
            "disability_status": rule["disability_allowed"] if rule["disability_allowed"].lower() != "any" else random.choice(VALID_DISABILITIES),
            "education_level": random.choice(rule["education_levels"].split(',')) if rule["education_levels"].lower() != "any" else random.choice(VALID_EDUCATIONS),
        }
        
        # We created a perfect user, so it must be eligible for the target rule.
        # Now, check its eligibility against ALL schemes to create a correct multi-label vector.
        if is_eligible(user, rule):
            pos_count += 1
            row_labels = [1 if is_eligible(user, r) else 0 for _, r in rules.iterrows()]
            data.append(user)
            labels.append(row_labels)

    # --- Generate Negative Samples ---
    neg_count = 0
    attempts = 0
    while neg_count < samples_per_scheme // 2 and attempts < max_attempts:
        attempts += 1
        user = {
            "age": random.randint(0, 100),
            "annual_income": random.randint(0, 2000000), # Realistic random income range
            "state": random.choice(VALID_STATES),
            "gender": random.choice(VALID_GENDERS),
            "caste": random.choice(VALID_CASTES),
            "employment_type": random.choice(VALID_EMPLOYMENTS),
            "disability_status": random.choice(VALID_DISABILITIES),
            "education_level": random.choice(VALID_EDUCATIONS),
        }
        
        # Ensure this random user is NOT eligible for the current scheme
        if not is_eligible(user, rule):
            neg_count += 1
            # Check eligibility against ALL schemes to create the multi-label vector
            row_labels = [1 if is_eligible(user, r) else 0 for _, r in rules.iterrows()]
            data.append(user)
            labels.append(row_labels)
    
    if (index + 1) % 10 == 0:
        print(f"  Processed {index + 1}/{len(rules)} schemes...")


# --- Save the Final Dataset ---
df = pd.DataFrame(data)
labels_df = pd.DataFrame(labels, columns=rules["scheme_id"].tolist())
dataset = pd.concat([df, labels_df], axis=1)
dataset.to_csv("training_dataset.csv", index=False)

print("\n-------------------------------------------")
print(f"✅ Generated balanced dataset with shape: {dataset.shape}")
print("-------------------------------------------")
# Verify that we have positive labels for all schemes
positive_counts = labels_df.sum()
print("Number of positive samples generated per scheme:")
print(positive_counts)

schemes_with_zero_positives = positive_counts[positive_counts == 0]
if not schemes_with_zero_positives.empty:
    print("\nWARNING: The following schemes had 0 positive samples generated. Check their rules in schemes_rules.csv!")
    print(schemes_with_zero_positives)
else:
    print("\n✅ All schemes have at least one positive sample.")

