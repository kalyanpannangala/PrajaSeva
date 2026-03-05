# evaluate_tax_model.py - Load existing tax_model and evaluate with train/test split
import pandas as pd, joblib
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, confusion_matrix, classification_report

BASE = Path(__file__).resolve().parent

# Load dataset
data = pd.read_csv(BASE / "training_dataset.csv")

# Load artifacts
clf = joblib.load(BASE / "tax_model.pkl")
feature_cols = joblib.load(BASE / "feature_columns.pkl")

# Prepare features and target
X = data[feature_cols]
y = (data['best_regime'] == 'old').astype(int)

# Split into train/test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Evaluate on test set
y_pred = clf.predict(X_test)

acc = accuracy_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)

print(f"✅ Test Accuracy: {acc:.4f}")
print(f"✅ Test F1 Score: {f1:.4f}")
print("\n📊 Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))
print("\n📋 Classification Report:")
print(classification_report(y_test, y_pred))