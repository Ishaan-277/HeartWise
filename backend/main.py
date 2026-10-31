from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import os
import shap

# Load the trained ML pipeline
MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "model",
    "heart_disease_model.pkl"
)

model = joblib.load(MODEL_PATH)

# SHAP explainer for the Random Forest model
preprocessor = model.named_steps["preprocessor"]
classifier = model.named_steps["classifier"]

explainer = shap.TreeExplainer(classifier)
# Create FastAPI app
app = FastAPI(
    title="Heart Disease Prediction API",
    description="API for heart disease risk prediction",
    version="1.0"
)



# Allow our React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Patient data that the frontend will send
class PatientData(BaseModel):
    age: float
    sex: float
    cp: float
    trestbps: float
    chol: float
    fbs: float
    restecg: float
    thalach: float
    exang: float
    oldpeak: float
    slope: float
    ca: float
    thal: float


@app.post("/predict")
def predict(data: PatientData):

    # Convert incoming data into a DataFrame
    patient_df = pd.DataFrame([data.model_dump()])

    # Preprocess patient data
    processed_data = preprocessor.transform(patient_df)

    # Get prediction
    prediction = model.predict(patient_df)[0]

    # Get probability of class 1
    probability = model.predict_proba(patient_df)[0, 1]

    # -----------------------------
    # SHAP EXPLANATION
    # -----------------------------

    shap_values = explainer.shap_values(processed_data)

    # For binary classification, get class 1 SHAP values
    if isinstance(shap_values, list):
        patient_shap = shap_values[1][0]
    else:
        patient_shap = shap_values[0, :, 1]

    feature_names = preprocessor.get_feature_names_out()

    # Create feature contribution list
    contributions = []

    for feature, value in zip(feature_names, patient_shap):
        contributions.append({
            "feature": feature,
            "shap_value": round(float(value), 4),
            "impact": "increases risk" if value > 0 else "decreases risk"
        })

    # Sort by absolute SHAP value
    contributions.sort(
        key=lambda x: abs(x["shap_value"]),
        reverse=True
    )

    # Keep the top 8 most influential factors
    top_contributions = contributions[:8]

    # Convert prediction into readable text
    if prediction == 1:
        result = "Heart Disease"
    else:
        result = "No Heart Disease"

    return {
        "prediction": int(prediction),
        "result": result,
        "probability": round(float(probability), 4),
        "explanations": top_contributions
    }