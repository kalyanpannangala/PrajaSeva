import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.multioutput import MultiOutputClassifier
from sklearn.ensemble import RandomForestClassifier
import joblib
import time

def load_dataset():
    print("📂 Loading dataset...")
    df = pd.read_csv("training_dataset.csv")
    print(f"✅ Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")
    return df

def build_pipeline():
    categorical_cols = ["state", "gender", "caste", "employment_type", "disability_status", "education_level"]
    numeric_cols = ["age", "annual_income"]

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_cols),
            ("num", "passthrough", numeric_cols)
        ],
        remainder="drop"
    )

    clf = Pipeline(steps=[
        ("preprocessor", preprocessor),
        # Reduce n_estimators for speed; can increase later if needed
        ("classifier", MultiOutputClassifier(
            RandomForestClassifier(
                n_estimators=75,  # Less trees for faster training
                max_depth=18,      # Prevent huge tree growth
                min_samples_leaf=5,
                n_jobs=-1,         # Use all CPU cores
                random_state=42
            )
        ))
    ])
    return clf

def train():
    start_time = time.time()
    df = load_dataset()

    feature_cols = ["age", "annual_income", "state", "gender", "caste",
                    "employment_type", "disability_status", "education_level"]
    target_cols = [col for col in df.columns if col not in feature_cols]

    print(f"🛠 Features: {len(feature_cols)}, Targets: {len(target_cols)} schemes")

    X = df[feature_cols]
    y_bin = df[target_cols]

    print("🚀 Training model...")
    pipeline = build_pipeline()
    pipeline.fit(X, y_bin)

    joblib.dump(pipeline, "schemes_model.pkl", compress=("xz", 3))

    joblib.dump(target_cols, "label_encoder.pkl")

    elapsed_time = time.time() - start_time
    print(f"✅ Model training complete in {elapsed_time:.2f} seconds and saved!")

if __name__ == "__main__":
    train()
