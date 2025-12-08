import pandas as pd
import joblib
from sklearn.metrics import accuracy_score, f1_score, hamming_loss

def load_artifacts():
    # Load trained pipeline and target labels
    pipeline = joblib.load("schemes_model.pkl")
    target_cols = joblib.load("label_encoder.pkl")
    return pipeline, target_cols

def load_dataset():
    # Load dataset (replace with test_dataset.csv if you have one)
    df = pd.read_csv("training_dataset.csv")
    return df

def evaluate_model():
    pipeline, target_cols = load_artifacts()
    df = load_dataset()

    # Define features and targets
    feature_cols = ["age", "annual_income", "state", "gender", "caste",
                    "employment_type", "disability_status", "education_level"]

    X = df[feature_cols]
    y_true = df[target_cols]

    print("🔎 Testing model accuracy...")
    y_pred = pipeline.predict(X)

    # Metrics
    acc = accuracy_score(y_true, y_pred)
    f1_micro = f1_score(y_true, y_pred, average="micro")
    f1_macro = f1_score(y_true, y_pred, average="macro")
    hamming = hamming_loss(y_true, y_pred)

    print(f"✅ Accuracy: {acc:.4f}")
    print(f"✅ F1 (Micro): {f1_micro:.4f}")
    print(f"✅ F1 (Macro): {f1_macro:.4f}")
    print(f"✅ Hamming Loss: {hamming:.4f}")

if __name__ == "__main__":
    evaluate_model()