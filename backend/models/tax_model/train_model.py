# train_model.py - Trains tax regime recommender using generated training_dataset.csv
import pandas as pd, joblib
from pathlib import Path
from sklearn.tree import DecisionTreeClassifier

BASE = Path(__file__).resolve().parent
data = pd.read_csv(BASE / "training_dataset.csv")

feature_cols = ['age','annual_income','is_salaried','investment_80c','investment_80d','home_loan_interest','education_loan_interest','donations_80g','other_deductions','standard_deduction']
X = data[feature_cols]
y = (data['best_regime'] == 'old').astype(int)

clf = DecisionTreeClassifier(max_depth=8, random_state=42)
clf.fit(X, y)

joblib.dump(clf, BASE / "tax_model.pkl")
joblib.dump(feature_cols, BASE / "feature_columns.pkl")

print('Training complete. Model saved as tax_model.pkl')