import pandas as pd
from sklearn.preprocessing import OneHotEncoder, MultiLabelBinarizer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.multioutput import MultiOutputClassifier
from sklearn.ensemble import RandomForestClassifier
import joblib

def load_dataset():
    # Load training data
    df = pd.read_csv("training_dataset.csv")
    return df

def build_pipeline():
    categorical_cols = ["state", "gender", "caste", "employment_type", "disability_status", "education_level"]
    numeric_cols = ["age", "annual_income"]

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols),
            ("num", "passthrough", numeric_cols)
        ]
    )

    clf = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("classifier", MultiOutputClassifier(RandomForestClassifier(n_estimators=200, random_state=42)))
    ])
    return clf

def train():
    df = load_dataset()
    
    # Assuming last N columns are scheme eligibility flags
    feature_cols = ["age", "annual_income", "state", "gender", "caste", 
                    "employment_type", "disability_status", "education_level"]
    target_cols = [col for col in df.columns if col not in feature_cols]
    
    X = df[feature_cols]
    y_bin = df[target_cols]

    pipeline = build_pipeline()
    pipeline.fit(X, y_bin)

    joblib.dump(pipeline, "scheme_model.pkl")
    joblib.dump(target_cols, "label_encoder.pkl")  # Saving column names instead of MultiLabelBinarizer
    print("✅ Model training complete and saved!")


if __name__ == "__main__":
    train()
