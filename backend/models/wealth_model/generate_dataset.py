import csv
import random

# Read schemes from schemes_rules.csv
with open("schemes_rules.csv", newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    schemes = list(reader)

dataset = []
for scheme in schemes:
    for _ in range(200):  # generate multiple synthetic user samples per scheme
        user_age = random.randint(18, 70)
        user_investment = random.randint(10, 1000000)
        years_to_invest = random.randint(1, 50)

        # Ensure numeric fields
        min_inv = float(scheme["min_investment"])
        max_inv = float('inf') if scheme["max_investment"].lower() == 'any' else float(scheme["max_investment"])
        age_min = int(scheme["eligible_age_min"])
        age_max = float('inf') if scheme["eligible_age_max"].lower() == 'any' else int(scheme["eligible_age_max"])

        if age_min <= user_age <= age_max and min_inv <= user_investment <= max_inv:
            dataset.append({
                "user_age": user_age,
                "investment_amount": user_investment,
                "years_to_invest": years_to_invest,
                "risk_level": scheme["risk_level"],
                "liquidity": scheme["liquidity"],
                "recommended_scheme": scheme["scheme_name"]
            })

# Write to training_dataset.csv
with open("training_dataset.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=[
        "user_age", "investment_amount", "years_to_invest",
        "risk_level", "liquidity", "recommended_scheme"
    ])
    writer.writeheader()
    writer.writerows(dataset)

print(f"✅ Generated training_dataset.csv with {len(dataset)} rows.")
