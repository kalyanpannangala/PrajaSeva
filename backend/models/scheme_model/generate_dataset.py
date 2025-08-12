import pandas as pd
import random

# Load rules
rules = pd.read_csv("schemes_rules.csv")

# Possible values
states = list(set(rules["state"].unique()) - {"ALL"}) + ["Any"]
genders = ["Male", "Female", "Any"]
castes = ["General", "OBC", "SC", "ST", "Any"]
employments = ["Farmer", "Private-employed", "Government-employed", "Retired", "Self-employed", "Any"]
disabilities = ["Yes", "No", "Any"]
educations = ["Graduate", "Postgraduate", "Other", "Any"]

def is_eligible(user, rule):
    # Check state
    if rule["state"] != "ALL" and rule["state"].lower() != user["state"].lower() and user["state"] != "Any":
        return False
    # Age
    if not (rule["age_min"] <= user["age"] <= rule["age_max"]):
        return False
    # Income
    if not (rule["annual_income_min"] <= user["annual_income"] <= rule["annual_income_max"]):
        return False
    # Gender
    if rule["allowed_genders"] != "Any" and rule["allowed_genders"].lower() != user["gender"].lower() and user["gender"] != "Any":
        return False
    # Caste
    if rule["allowed_castes"] != "Any" and rule["allowed_castes"].lower() != user["caste"].lower() and user["caste"] != "Any":
        return False
    # Employment
    if rule["allowed_employments"] != "Any" and rule["allowed_employments"].lower() != user["employment_type"].lower() and user["employment_type"] != "Any":
        return False
    # Disability
    if rule["disability_allowed"] != "Any" and rule["disability_allowed"].lower() != user["disability_status"].lower() and user["disability_status"] != "Any":
        return False
    # Education
    if rule["education_levels"] != "Any" and rule["education_levels"].lower() != user["education_level"].lower() and user["education_level"] != "Any":
        return False
    return True

data = []
labels = []

for _ in range(50000):
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
    eligible = []
    for _, rule in rules.iterrows():
        eligible.append(1 if is_eligible(user, rule) else 0)

    data.append(user)
    labels.append(eligible)

df = pd.DataFrame(data)
labels_df = pd.DataFrame(labels, columns=rules["scheme_id"].tolist())

dataset = pd.concat([df, labels_df], axis=1)
dataset.to_csv("training_dataset.csv", index=False)

print("✅ Generated dataset with shape:", dataset.shape)
