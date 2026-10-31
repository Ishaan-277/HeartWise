# HeartWise - Explainable Heart Disease Risk Prediction System

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.4+-F7931E.svg?logo=scikitlearn&logoColor=white)](https://scikit-learn.org/)
[![SHAP](https://img.shields.io/badge/SHAP-Explainability-brightgreen.svg)](https://shap.readthedocs.io/)

**HeartWise** is an end-to-end clinical decision support web application that assesses heart disease risk using a trained Machine Learning pipeline and provides **model explainability via SHAP (SHapley Additive exPlanations)**.

Instead of functioning as a black-box model, HeartWise visualizes the specific clinical factors that contribute to increasing or decreasing an individual patient's cardiovascular risk score.

---

## Key Features

- **Accurate Risk Assessment**: Machine learning pipeline (Random Forest Classifier + Preprocessing) trained on clinical heart disease data.
- **Explainable AI (XAI)**: Dynamic SHAP tree explanations highlight top positive and negative risk contributors for every prediction.
- **Modern Interactive Dashboard**: Responsive user interface built with React 19, Vite, Lucide Icons, and Framer Motion animations.
- **Fast & Scalable REST API**: Powered by FastAPI with automated validation using Pydantic schemas.

---

## Architecture & Tech Stack

```
Heart_Disease_Risk_Prediction/
├── backend/                  # FastAPI Application
│   ├── main.py               # API routes, CORS setup, SHAP explainer
│   └── requirements.txt      # Python dependencies
├── frontend/                 # React + Vite Application
│   ├── src/                  # UI components, styles & interactive forms
│   ├── package.json          # Node dependencies & scripts
│   └── vite.config.js        # Vite build configuration
├── model/                    # Pretrained Machine Learning Artifacts
│   └── heart_disease_model.pkl # Scikit-learn Pipeline (Preprocessor + Classifier)
├── notebooks/                # Exploratory Data Analysis & Model Training
│   └── 01_data_understanding.ipynb
├── requirements.txt          # Root Python dependencies
└── README.md                 # Project documentation
```

### Stack Breakdown
- **Frontend**: React 19, Vite, Framer Motion, Lucide React, Oxlint
- **Backend**: FastAPI, Uvicorn, Pydantic, Scikit-learn, SHAP, Pandas, NumPy
- **Machine Learning**: Random Forest Classifier with standard scaling & preprocessing pipeline

---

## Getting Started

Follow these instructions to set up and run HeartWise locally on your machine.

### Prerequisites

- **Python**: Version 3.10+ installed
- **Node.js**: Version 18+ and `npm` installed
- **Git**: Installed on your system

---

### 1. Clone the Repository

```bash
git clone https://github.com/Ishaan-277/HeartWise.git
cd HeartWise
```

---

### 2. Backend Setup (FastAPI)

1. Open a terminal and navigate to the project directory:
   ```bash
   cd HeartWise
   ```

2. Create a virtual environment and activate it:
   - **Windows (PowerShell)**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - **Linux / macOS**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the backend server:
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```
   The backend API will be available at [http://localhost:8000](http://localhost:8000).  
   Interactive Swagger documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

### 3. Frontend Setup (React + Vite)

1. Open a second terminal window and navigate to the frontend directory:
   ```bash
   cd HeartWise/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:5173
   ```

---

## API Reference

### `POST /predict`

Predicts cardiovascular disease risk and outputs the top SHAP factor contributions.

#### Request Body (JSON)
```json
{
  "age": 55.0,
  "sex": 1.0,
  "cp": 2.0,
  "trestbps": 130.0,
  "chol": 240.0,
  "fbs": 0.0,
  "restecg": 1.0,
  "thalach": 150.0,
  "exang": 0.0,
  "oldpeak": 1.2,
  "slope": 1.0,
  "ca": 0.0,
  "thal": 2.0
}
```

#### Clinical Parameters Definition
- `age`: Age in years
- `sex`: Sex (1 = male, 0 = female)
- `cp`: Chest pain type (0-3)
- `trestbps`: Resting blood pressure (mm Hg)
- `chol`: Serum cholesterol in mg/dl
- `fbs`: Fasting blood sugar > 120 mg/dl (1 = true, 0 = false)
- `restecg`: Resting electrocardiographic results (0-2)
- `thalach`: Maximum heart rate achieved
- `exang`: Exercise-induced angina (1 = yes, 0 = no)
- `oldpeak`: ST depression induced by exercise relative to rest
- `slope`: The slope of the peak exercise ST segment (0-2)
- `ca`: Number of major vessels colored by fluoroscopy (0-3)
- `thal`: Thalassemia category (1 = normal, 2 = fixed defect, 3 = reversible defect)

#### Sample Response (JSON)
```json
{
  "prediction": 0,
  "result": "No Heart Disease",
  "probability": 0.28,
  "explanations": [
    {
      "feature": "thalach",
      "shap_value": -0.142,
      "impact": "decreases risk"
    },
    {
      "feature": "ca",
      "shap_value": -0.115,
      "impact": "decreases risk"
    }
  ]
}
```

---

## Disclaimer

This software is developed strictly for educational and research purposes. It is **not** a substitute for professional medical advice, clinical diagnosis, or treatment.

---

## License

This project is licensed under the MIT License - feel free to use and modify for educational or personal projects.
