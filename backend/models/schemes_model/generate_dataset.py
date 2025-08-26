import pandas as pd
import random

# Load rules
rules = pd.read_csv("schemes_rules.csv")

# Replace "Any" or missing values with default numbers
rules["age_min"] = pd.to_numeric(rules["age_min"], errors="coerce").fillna(0).astype(int)
rules["age_max"] = pd.to_numeric(rules["age_max"], errors="coerce").fillna(100).astype(int)
rules["annual_income_min"] = pd.to_numeric(rules["annual_income_min"], errors="coerce").fillna(0).astype(int)
rules["annual_income_max"] = pd.to_numeric(rules["annual_income_max"], errors="coerce").fillna(10**9).astype(int)

# Possible values
states = list(set(rules["state"].unique()) - {"ALL"}) + ["Any"]
genders = ["Male", "Female", "Any"]
castes = ["General", "OBC", "SC", "ST", "Any"]
employments = ["Student", "Farmer", "Private-employed", "Government-employed", "Retired", "Self-employed", "Un-employed", "Any"]
disabilities = ["Yes", "No", "Any"]
educations = ["Secondary", "Graduate", "Postgraduate", "Un-educated", "Other", "Any"]

def is_eligible(user, rule):
    def match(val_rule, val_user):
        return str(val_rule).strip().lower() == "any" or str(val_rule).strip().lower() == str(val_user).strip().lower()

    if rule["state"] != "ALL" and not match(rule["state"], user["state"]):
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

# Balanced dataset generation
data = []
labels = []
samples_per_scheme = 60
max_attempts = samples_per_scheme * 20

for _, rule in rules.iterrows():
    scheme_id = rule["scheme_id"]

    # Positive samples
    pos_count = 0
    attempts = 0
    while pos_count < samples_per_scheme // 2 and attempts < max_attempts:
        attempts += 1
        user = {
            "age": random.randint(rule["age_min"], rule["age_max"]),
            "annual_income": random.randint(rule["annual_income_min"], rule["annual_income_max"]),
            "state": rule["state"] if rule["state"] != "ALL" else random.choice(states),
            "gender": rule["allowed_genders"] if rule["allowed_genders"] != "Any" else random.choice(genders),
            "caste": rule["allowed_castes"] if rule["allowed_castes"] != "Any" else random.choice(castes),
            "employment_type": rule["allowed_employments"] if rule["allowed_employments"] != "Any" else random.choice(employments),
            "disability_status": rule["disability_allowed"] if rule["disability_allowed"] != "Any" else random.choice(disabilities),
            "education_level": rule["education_levels"] if rule["education_levels"] != "Any" else random.choice(educations),
        }
        if is_eligible(user, rule):
            pos_count += 1
            row_labels = [1 if scheme_id == sid else 0 for sid in rules["scheme_id"]]
            data.append(user)
            labels.append(row_labels)

    # Negative samples
    neg_count = 0
    attempts = 0
    while neg_count < samples_per_scheme // 2 and attempts < max_attempts:
        attempts += 1
        user = {
            "age": random.randint(0, 100),
            "annual_income": random.randint(0, 1000000),
            "state": random.choice(states),
            "gender": random.choice(genders),
            "caste": random.choice(castes),
            "employment_type": random.choice(employments),
            "disability_status": random.choice(disabilities),
            "education_level": random.choice(educations),
        }
        if not is_eligible(user, rule):
            neg_count += 1
            row_labels = [1 if is_eligible(user, r) else 0 for _, r in rules.iterrows()]
            data.append(user)
            labels.append(row_labels)

# Save dataset
df = pd.DataFrame(data)
labels_df = pd.DataFrame(labels, columns=rules["scheme_id"].tolist())
dataset = pd.concat([df, labels_df], axis=1)
dataset.to_csv("training_dataset.csv", index=False)

print(f"✅ Generated balanced dataset with shape: {dataset.shape}")
