# evaluate_investment_model.py - Load existing investment_model and test with train/test split
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, classification_report, confusion_matrix

# Load dataset
df = pd.read_csv("training_dataset.csv")

# Load trained pipeline
pipeline = joblib.load("investment_model.pkl")

# Features and target
X = df.drop(columns=["recommended_scheme"])
y = df["recommended_scheme"]

# Train-test split (only using test set for evaluation)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Predict on test set
y_pred = pipeline.predict(X_test)

# Evaluation metrics
acc = accuracy_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred, average="weighted")  # weighted handles class imbalance

print(f"✅ Test Accuracy: {acc:.4f}")
print(f"✅ Test F1 Score (Weighted): {f1:.4f}")
print("\n📊 Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))
print("\n📋 Classification Report:")
print(classification_report(y_test, y_pred))