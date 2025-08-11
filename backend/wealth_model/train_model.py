import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
import joblib
import pickle

# Load training dataset
df = pd.read_csv("training_dataset.csv")

X = df.drop(columns=["recommended_scheme"])
y = df["recommended_scheme"]

# Preprocessing
categorical_features = ["risk_level", "liquidity"]
numeric_features = ["user_age", "investment_amount", "years_to_invest"]

preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),
        ("num", "passthrough", numeric_features)
    ]
)

# Model pipeline
pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", RandomForestClassifier(n_estimators=100, random_state=42))
])

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
pipeline.fit(X_train, y_train)

# Save model with joblib
joblib.dump(pipeline, "investment_model.pkl")



print("✅ Model trained and saved as investment_model.pkl")
