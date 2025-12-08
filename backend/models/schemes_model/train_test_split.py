import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, hamming_loss

def load_artifacts():
    pipeline = joblib.load("schemes_model.pkl")
    target_cols = joblib.load("label_encoder.pkl")
    return pipeline, target_cols

def load_dataset():
    df = pd.read_csv("training_dataset.csv")
    return df

def evaluate_on_test_split(test_size=0.2, random_state=42):
    pipeline, target_cols = load_artifacts()
    df = load_dataset()

    feature_cols = ["age", "annual_income", "state", "gender", "caste",
                    "employment_type", "disability_status", "education_level"]

    X = df[feature_cols]
    y = df[target_cols]

    # Split into train/test (but only use test for evaluation)
    _, X_test, _, y_test = train_test_split(X, y, test_size=test_size, random_state=random_state)

    print(f"🧪 Evaluating on {len(X_test)} test samples...")
    y_pred = pipeline.predict(X_test)

    acc = accuracy_score(y_test, y_pred)
    f1_micro = f1_score(y_test, y_pred, average="micro")
    f1_macro = f1_score(y_test, y_pred, average="macro")
    hamming = hamming_loss(y_test, y_pred)

    print(f"✅ Test Accuracy: {acc:.4f}")
    print(f"✅ Test F1 (Micro): {f1_micro:.4f}")
    print(f"✅ Test F1 (Macro): {f1_macro:.4f}")
    print(f"✅ Test Hamming Loss: {hamming:.4f}")

if __name__ == "__main__":
    evaluate_on_test_split()