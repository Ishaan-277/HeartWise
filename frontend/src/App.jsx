import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  HeartPulse,
  Brain,
  ShieldCheck,
  ArrowRight,
  Activity,
  Sparkles,
  ChevronLeft,
  User,
  Stethoscope,
  Gauge,
  Heart,
  RotateCcw,
  AlertCircle,
} from "lucide-react";

import "./App.css";


function App() {

  // =========================================================
  // PAGE STATE
  // =========================================================

  const [page, setPage] = useState("home");

  const [prediction, setPrediction] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  // =========================================================
  // FORM DATA
  // =========================================================

  const [formData, setFormData] = useState({
    age: "",
    sex: "",
    cp: "",
    trestbps: "",
    chol: "",
    fbs: "",
    restecg: "",
    thalach: "",
    exang: "",
    oldpeak: "",
    slope: "",
    ca: "",
    thal: "",
  });


  // =========================================================
  // UPDATE FORM FIELD
  // =========================================================

  const updateField = (field, value) => {

    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (error) {
      setError("");
    }
  };


  // =========================================================
  // FORM VALIDATION
  // =========================================================

  const validateForm = () => {

    const requiredFields = [
      "age",
      "sex",
      "cp",
      "trestbps",
      "chol",
      "fbs",
      "restecg",
      "thalach",
      "exang",
      "oldpeak",
      "slope",
      "ca",
      "thal",
    ];

    for (const field of requiredFields) {

      if (
        formData[field] === "" ||
        formData[field] === null ||
        formData[field] === undefined
      ) {

        return "Please complete all 13 health indicators before continuing.";
      }
    }


    const age = Number(formData.age);
    const trestbps = Number(formData.trestbps);
    const chol = Number(formData.chol);
    const thalach = Number(formData.thalach);
    const oldpeak = Number(formData.oldpeak);


    if (age < 1 || age > 120) {
      return "Please enter a valid age between 1 and 120.";
    }


    if (trestbps <= 0) {
      return "Please enter a valid resting blood pressure.";
    }


    if (chol <= 0) {
      return "Please enter a valid cholesterol value.";
    }


    if (thalach <= 0) {
      return "Please enter a valid maximum heart rate.";
    }


    if (oldpeak < 0) {
      return "ST depression cannot be negative.";
    }


    return null;
  };


  // =========================================================
  // SEND DATA TO FASTAPI
  // =========================================================

  const analyzeRisk = async () => {

    setError("");


    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }


    setLoading(true);


    try {

      const patientData = {

        age: Number(formData.age),

        sex: Number(formData.sex),

        cp: Number(formData.cp),

        trestbps: Number(formData.trestbps),

        chol: Number(formData.chol),

        fbs: Number(formData.fbs),

        restecg: Number(formData.restecg),

        thalach: Number(formData.thalach),

        exang: Number(formData.exang),

        oldpeak: Number(formData.oldpeak),

        slope: Number(formData.slope),

        ca: Number(formData.ca),

        thal: Number(formData.thal),
      };


      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(patientData),
        }
      );


      if (!response.ok) {

        throw new Error(
          `Prediction request failed with status ${response.status}`
        );
      }


      const result = await response.json();


      console.log("Prediction result:", result);


      setPrediction(result);

      setPage("results");

      window.scrollTo(0, 0);

    } catch (err) {

      console.error("Prediction error:", err);

      setError(
        "Unable to connect to the prediction service. Please make sure the backend is running."
      );

    } finally {

      setLoading(false);
    }
  };


  // =========================================================
  // START ASSESSMENT
  // =========================================================

  const startAssessment = () => {

    setPage("assessment");

    setError("");

    window.scrollTo(0, 0);
  };


  // =========================================================
  // GO HOME
  // =========================================================

  const goHome = () => {

    setPage("home");

    setError("");

    window.scrollTo(0, 0);
  };


  // =========================================================
  // NEW ASSESSMENT
  // =========================================================

  const startNewAssessment = () => {

    setFormData({
      age: "",
      sex: "",
      cp: "",
      trestbps: "",
      chol: "",
      fbs: "",
      restecg: "",
      thalach: "",
      exang: "",
      oldpeak: "",
      slope: "",
      ca: "",
      thal: "",
    });


    setPrediction(null);

    setError("");

    setPage("assessment");

    window.scrollTo(0, 0);
  };


  // =========================================================
  // RISK HELPERS
  // =========================================================

  const getRiskLabel = () => {

    if (!prediction) {
      return "";
    }

    const probability = prediction.probability * 100;


    if (probability < 30) {
      return "Lower model-estimated risk";
    }


    if (probability < 60) {
      return "Moderate model-estimated risk";
    }


    return "Higher model-estimated risk";
  };


  const getRiskClass = () => {

    if (!prediction) {
      return "";
    }

    const probability = prediction.probability * 100;


    if (probability < 30) {
      return "low";
    }


    if (probability < 60) {
      return "moderate";
    }


    return "high";
  };


  // =========================================================
  // SHAP FEATURE NAME CONVERTER
  // =========================================================

  const getFeatureLabel = (feature) => {

    const featureMap = {

      "num__age": "Age",

      "num__trestbps": "Resting Blood Pressure",

      "num__chol": "Cholesterol",

      "num__thalach": "Maximum Heart Rate",

      "num__oldpeak": "ST Depression",

      "num__ca": "Major Vessels",

      "num__fbs": "Fasting Blood Sugar",

      "cat__sex_0.0": "Sex",

      "cat__sex_1.0": "Sex",

      "cat__cp_1.0": "Chest Pain Type",

      "cat__cp_2.0": "Chest Pain Type",

      "cat__cp_3.0": "Chest Pain Type",

      "cat__cp_4.0": "Chest Pain Type",

      "cat__fbs_0.0": "Fasting Blood Sugar",

      "cat__fbs_1.0": "Fasting Blood Sugar",

      "cat__restecg_0.0": "Resting ECG",

      "cat__restecg_1.0": "Resting ECG",

      "cat__restecg_2.0": "Resting ECG",

      "cat__exang_0.0": "Exercise-Induced Angina",

      "cat__exang_1.0": "Exercise-Induced Angina",

      "cat__slope_1.0": "ST Segment Slope",

      "cat__slope_2.0": "ST Segment Slope",

      "cat__slope_3.0": "ST Segment Slope",

      "cat__thal_3.0": "Thalassemia",

      "cat__thal_6.0": "Thalassemia",

      "cat__thal_7.0": "Thalassemia",
    };


    return (
      featureMap[feature] ||
      feature
        .replace("num__", "")
        .replace("cat__", "")
        .replaceAll("_", " ")
    );
  };


  // =========================================================
  // SHAP CATEGORY DETAIL
  // =========================================================

  const getFeatureDetail = (feature) => {

    if (feature.includes("cp_1")) {
      return "Typical angina";
    }

    if (feature.includes("cp_2")) {
      return "Atypical angina";
    }

    if (feature.includes("cp_3")) {
      return "Non-anginal pain";
    }

    if (feature.includes("cp_4")) {
      return "Asymptomatic";
    }

    if (feature.includes("thal_3")) {
      return "Normal";
    }

    if (feature.includes("thal_6")) {
      return "Fixed defect";
    }

    if (feature.includes("thal_7")) {
      return "Reversible defect";
    }

    if (feature.includes("slope_1")) {
      return "Upsloping";
    }

    if (feature.includes("slope_2")) {
      return "Flat";
    }

    if (feature.includes("slope_3")) {
      return "Downsloping";
    }

    if (feature.includes("sex_0")) {
      return "Female";
    }

    if (feature.includes("sex_1")) {
      return "Male";
    }

    if (feature.includes("exang_0")) {
      return "No";
    }

    if (feature.includes("exang_1")) {
      return "Yes";
    }

    if (feature.includes("restecg_0")) {
      return "Normal";
    }

    if (feature.includes("restecg_1")) {
      return "ST-T wave abnormality";
    }

    if (feature.includes("restecg_2")) {
      return "Left ventricular hypertrophy";
    }

    if (feature.includes("fbs_0")) {
      return "Normal";
    }

    if (feature.includes("fbs_1")) {
      return "Above 120 mg/dl";
    }

    return "";
  };


  // =========================================================
  // GET SHAP EXPLANATIONS
  // =========================================================

  const getExplanations = () => {

    if (
      !prediction ||
      !prediction.explanations ||
      prediction.explanations.length === 0
    ) {
      return [];
    }


    return prediction.explanations.slice(0, 6);
  };


  // =========================================================
  // SHAP BAR WIDTH
  // =========================================================

  const getShapWidth = (shapValue) => {

    const explanations = getExplanations();

    if (explanations.length === 0) {
      return 0;
    }


    const maxValue = Math.max(
      ...explanations.map(
        (item) => Math.abs(item.shap_value)
      )
    );


    if (maxValue === 0) {
      return 0;
    }


    return (
      (Math.abs(shapValue) / maxValue) * 100
    );
  };


  // =========================================================
  // MAIN UI
  // =========================================================

  return (

    <div className="app">


      {/* BACKGROUND EFFECTS */}

      <div className="background-glow glow-one"></div>

      <div className="background-glow glow-two"></div>


      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <nav className="navbar">

        <div className="logo">

          <div className="logo-icon">
            <HeartPulse size={22} />
          </div>

          <span>
            HeartWise
          </span>

        </div>


        {page === "home" && (

          <>

            <div className="nav-links">

              <a href="#how-it-works">
                How it works
              </a>

              <a href="#about">
                About
              </a>

            </div>


            <button
              className="nav-button"
              onClick={startAssessment}
            >
              Get Started
            </button>

          </>

        )}

      </nav>


      {/* =====================================================
          PAGE TRANSITIONS
      ====================================================== */}

      <AnimatePresence mode="wait">


        {/* ===================================================
            HOME PAGE
        ==================================================== */}

        {page === "home" && (

          <motion.div
            key="home"

            initial={{
              opacity: 0,
            }}

            animate={{
              opacity: 1,
            }}

            exit={{
              opacity: 0,
            }}
          >

            <main className="hero">


              {/* LEFT SIDE */}

              <motion.div
                className="hero-content"

                initial={{
                  opacity: 0,
                  x: -40,
                }}

                animate={{
                  opacity: 1,
                  x: 0,
                }}

                transition={{
                  duration: 0.8,
                }}
              >

                <div className="eyebrow">

                  <Sparkles size={15} />

                  AI-POWERED HEART HEALTH

                </div>


                <h1>

                  Understand your

                  <span>
                    {" "}heart.
                  </span>

                </h1>


                <p className="hero-description">

                  An intelligent machine learning system that
                  analyzes cardiovascular health indicators and
                  provides an easy-to-understand heart disease
                  risk assessment.

                </p>


                <div className="hero-buttons">

                  <button
                    className="primary-button"
                    onClick={startAssessment}
                  >

                    Start Assessment

                    <ArrowRight size={19} />

                  </button>


                  <a
                    href="#how-it-works"
                    className="secondary-button"
                  >

                    <Activity size={18} />

                    How it works

                  </a>

                </div>


                <div className="trust-row">

                  <div className="trust-item">

                    <Brain size={18} />

                    <span>
                      ML Powered
                    </span>

                  </div>


                  <div className="trust-item">

                    <ShieldCheck size={18} />

                    <span>
                      Explainable AI
                    </span>

                  </div>


                  <div className="trust-item">

                    <HeartPulse size={18} />

                    <span>
                      Risk Assessment
                    </span>

                  </div>

                </div>

              </motion.div>


              {/* RIGHT SIDE */}

              <motion.div
                className="heart-visual"

                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}

                animate={{
                  opacity: 1,
                  scale: 1,
                }}

                transition={{
                  duration: 1,
                }}
              >

                <div className="orbit orbit-one"></div>

                <div className="orbit orbit-two"></div>


                <motion.div
                  className="heart-circle"

                  animate={{
                    scale: [1, 1.04, 1],
                  }}

                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >

                  <div className="heart-glow"></div>

                  <HeartPulse
                    className="main-heart"
                    size={115}
                    strokeWidth={1.2}
                  />

                </motion.div>


                <motion.div
                  className="floating-card card-top"

                  animate={{
                    y: [0, -8, 0],
                  }}

                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >

                  <Activity size={19} />

                  <div>

                    <small>
                      AI Analysis
                    </small>

                    <strong>
                      Active
                    </strong>

                  </div>

                </motion.div>


                <motion.div
                  className="floating-card card-bottom"

                  animate={{
                    y: [0, 8, 0],
                  }}

                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >

                  <HeartPulse size={19} />

                  <div>

                    <small>
                      Risk Factors
                    </small>

                    <strong>
                      13 Indicators
                    </strong>

                  </div>

                </motion.div>

              </motion.div>

            </main>


            {/* =================================================
                INFORMATION CARDS
            ================================================== */}

            <section
              className="info-section"
              id="how-it-works"
            >

              <div className="info-card">

                <div className="info-icon">
                  <Brain size={22} />
                </div>

                <div>

                  <h3>
                    Machine Learning
                  </h3>

                  <p>
                    Multiple classification models were evaluated
                    to identify the strongest predictive approach.
                  </p>

                </div>

              </div>


              <div className="info-card">

                <div className="info-icon">
                  <Activity size={22} />
                </div>

                <div>

                  <h3>
                    Personalized Assessment
                  </h3>

                  <p>
                    Enter cardiovascular indicators to receive
                    an individualized model-based risk estimate.
                  </p>

                </div>

              </div>


              <div className="info-card">

                <div className="info-icon">
                  <Sparkles size={22} />
                </div>

                <div>

                  <h3>
                    Explainable Results
                  </h3>

                  <p>
                    Understand which features influenced the
                    model's prediction using explainable AI.
                  </p>

                </div>

              </div>

            </section>


            {/* FOOTER */}

            <footer>

              <span>
                © 2026 HeartWise
              </span>

              <span>
                AI-assisted risk assessment · Not a medical diagnosis
              </span>

            </footer>

          </motion.div>

        )}


        {/* ===================================================
            ASSESSMENT PAGE
        ==================================================== */}

        {page === "assessment" && (

          <motion.main
            key="assessment"

            className="assessment-page"

            initial={{
              opacity: 0,
              y: 25,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            exit={{
              opacity: 0,
              y: -25,
            }}

            transition={{
              duration: 0.5,
            }}
          >


            {/* HEADER */}

            <div className="assessment-header">

              <button
                className="back-button"
                onClick={goHome}
              >

                <ChevronLeft size={18} />

                Back

              </button>


              <div className="assessment-title">

                <div className="assessment-icon">

                  <Stethoscope size={24} />

                </div>


                <div>

                  <p>
                    HEART HEALTH ASSESSMENT
                  </p>

                  <h2>
                    Tell us about yourself
                  </h2>

                </div>

              </div>


              <div className="progress-info">

                <span>
                  13 indicators
                </span>

                <div className="progress-bar">

                  <div></div>

                </div>

              </div>

            </div>


            {/* INTRO */}

            <div className="assessment-intro">

              <div>

                <h1>

                  Let's understand your

                  <span>
                    {" "}heart health.
                  </span>

                </h1>


                <p>

                  Provide the following health information.
                  Our machine learning model will analyze these
                  cardiovascular indicators.

                </p>

              </div>


              <div className="privacy-note">

                <ShieldCheck size={20} />

                <span>

                  Your information is processed locally
                  for this assessment.

                </span>

              </div>

            </div>


            {/* FORM CONTAINER */}

            <div className="assessment-container">


              {/* PERSONAL INFORMATION */}

              <section className="form-section">

                <div className="section-heading">

                  <div className="section-icon">

                    <User size={20} />

                  </div>


                  <div>

                    <h3>
                      Personal Information
                    </h3>

                    <p>
                      Basic demographic information
                    </p>

                  </div>

                </div>


                <div className="form-grid">


                  {/* AGE */}

                  <div className="input-group">

                    <label>
                      Age
                    </label>

                    <input
                      type="number"
                      placeholder="e.g. 52"
                      min="1"
                      max="120"

                      value={formData.age}

                      onChange={(e) =>
                        updateField(
                          "age",
                          e.target.value
                        )
                      }
                    />

                    <span className="input-hint">
                      Age in years
                    </span>

                  </div>


                  {/* SEX */}

                  <div className="input-group">

                    <label>
                      Sex
                    </label>

                    <select
                      value={formData.sex}

                      onChange={(e) =>
                        updateField(
                          "sex",
                          e.target.value
                        )
                      }
                    >

                      <option value="">
                        Select sex
                      </option>

                      <option value="1">
                        Male
                      </option>

                      <option value="0">
                        Female
                      </option>

                    </select>

                  </div>

                </div>

              </section>


              {/* CARDIOVASCULAR INDICATORS */}

              <section className="form-section">

                <div className="section-heading">

                  <div className="section-icon">

                    <Heart size={20} />

                  </div>


                  <div>

                    <h3>
                      Cardiovascular Indicators
                    </h3>

                    <p>
                      Clinical measurements and heart function
                    </p>

                  </div>

                </div>


                <div className="form-grid">


                  {/* CHEST PAIN */}

                  <div className="input-group">

                    <label>
                      Chest Pain Type
                    </label>

                    <select
                      value={formData.cp}

                      onChange={(e) =>
                        updateField(
                          "cp",
                          e.target.value
                        )
                      }
                    >

                      <option value="">
                        Select type
                      </option>

                      <option value="1">
                        Typical Angina
                      </option>

                      <option value="2">
                        Atypical Angina
                      </option>

                      <option value="3">
                        Non-anginal Pain
                      </option>

                      <option value="4">
                        Asymptomatic
                      </option>

                    </select>

                  </div>


                  {/* RESTING BP */}

                  <div className="input-group">

                    <label>
                      Resting Blood Pressure
                    </label>

                    <input
                      type="number"
                      placeholder="e.g. 130"

                      value={formData.trestbps}

                      onChange={(e) =>
                        updateField(
                          "trestbps",
                          e.target.value
                        )
                      }
                    />

                    <span className="input-hint">
                      mm Hg
                    </span>

                  </div>


                  {/* CHOLESTEROL */}

                  <div className="input-group">

                    <label>
                      Cholesterol
                    </label>

                    <input
                      type="number"
                      placeholder="e.g. 220"

                      value={formData.chol}

                      onChange={(e) =>
                        updateField(
                          "chol",
                          e.target.value
                        )
                      }
                    />

                    <span className="input-hint">
                      mg/dl
                    </span>

                  </div>


                  {/* FBS */}

                  <div className="input-group">

                    <label>
                      Fasting Blood Sugar
                    </label>

                    <select
                      value={formData.fbs}

                      onChange={(e) =>
                        updateField(
                          "fbs",
                          e.target.value
                        )
                      }
                    >

                      <option value="">
                        Select
                      </option>

                      <option value="0">
                        Normal
                      </option>

                      <option value="1">
                        Above 120 mg/dl
                      </option>

                    </select>

                  </div>


                  {/* REST ECG */}

                  <div className="input-group">

                    <label>
                      Resting ECG
                    </label>

                    <select
                      value={formData.restecg}

                      onChange={(e) =>
                        updateField(
                          "restecg",
                          e.target.value
                        )
                      }
                    >

                      <option value="">
                        Select result
                      </option>

                      <option value="0">
                        Normal
                      </option>

                      <option value="1">
                        ST-T Wave Abnormality
                      </option>

                      <option value="2">
                        Left Ventricular Hypertrophy
                      </option>

                    </select>

                  </div>


                  {/* MAX HEART RATE */}

                  <div className="input-group">

                    <label>
                      Maximum Heart Rate
                    </label>

                    <input
                      type="number"
                      placeholder="e.g. 150"

                      value={formData.thalach}

                      onChange={(e) =>
                        updateField(
                          "thalach",
                          e.target.value
                        )
                      }
                    />

                    <span className="input-hint">
                      Maximum achieved heart rate
                    </span>

                  </div>


                  {/* EXERCISE ANGINA */}

                  <div className="input-group">

                    <label>
                      Exercise-Induced Angina
                    </label>

                    <select
                      value={formData.exang}

                      onChange={(e) =>
                        updateField(
                          "exang",
                          e.target.value
                        )
                      }
                    >

                      <option value="">
                        Select
                      </option>

                      <option value="0">
                        No
                      </option>

                      <option value="1">
                        Yes
                      </option>

                    </select>

                  </div>


                  {/* OLDPEAK */}

                  <div className="input-group">

                    <label>
                      ST Depression (Oldpeak)
                    </label>

                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 1.2"

                      value={formData.oldpeak}

                      onChange={(e) =>
                        updateField(
                          "oldpeak",
                          e.target.value
                        )
                      }
                    />

                    <span className="input-hint">
                      ST depression induced by exercise
                    </span>

                  </div>


                  {/* SLOPE */}

                  <div className="input-group">

                    <label>
                      ST Segment Slope
                    </label>

                    <select
                      value={formData.slope}

                      onChange={(e) =>
                        updateField(
                          "slope",
                          e.target.value
                        )
                      }
                    >

                      <option value="">
                        Select slope
                      </option>

                      <option value="1">
                        Upsloping
                      </option>

                      <option value="2">
                        Flat
                      </option>

                      <option value="3">
                        Downsloping
                      </option>

                    </select>

                  </div>


                  {/* MAJOR VESSELS */}

                  <div className="input-group">

                    <label>
                      Major Vessels
                    </label>

                    <select
                      value={formData.ca}

                      onChange={(e) =>
                        updateField(
                          "ca",
                          e.target.value
                        )
                      }
                    >

                      <option value="">
                        Select number
                      </option>

                      <option value="0">
                        0 vessels
                      </option>

                      <option value="1">
                        1 vessel
                      </option>

                      <option value="2">
                        2 vessels
                      </option>

                      <option value="3">
                        3 vessels
                      </option>

                    </select>

                  </div>


                  {/* THAL */}

                  <div className="input-group">

                    <label>
                      Thalassemia
                    </label>

                    <select
                      value={formData.thal}

                      onChange={(e) =>
                        updateField(
                          "thal",
                          e.target.value
                        )
                      }
                    >

                      <option value="">
                        Select result
                      </option>

                      <option value="3">
                        Normal
                      </option>

                      <option value="6">
                        Fixed Defect
                      </option>

                      <option value="7">
                        Reversible Defect
                      </option>

                    </select>

                  </div>

                </div>

              </section>


              {/* ERROR */}

              {error && (

                <motion.div
                  className="error-message"

                  initial={{
                    opacity: 0,
                    y: -10,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                >

                  <AlertCircle size={20} />

                  <span>
                    {error}
                  </span>

                </motion.div>

              )}


              {/* SUBMIT */}

              <section className="assessment-submit">

                <div className="submit-text">

                  <Gauge size={25} />

                  <div>

                    <h3>
                      Ready to analyze?
                    </h3>

                    <p>
                      Your information will be evaluated by
                      our trained machine learning model.
                    </p>

                  </div>

                </div>


                <button
                  className="analyze-button"

                  onClick={analyzeRisk}

                  disabled={loading}
                >

                  {loading ? (

                    <>

                      <span className="loading-spinner"></span>

                      Analyzing...

                    </>

                  ) : (

                    <>

                      Analyze My Risk

                      <ArrowRight size={19} />

                    </>

                  )}

                </button>

              </section>

            </div>

          </motion.main>

        )}


        {/* ===================================================
            RESULTS PAGE
        ==================================================== */}

        {page === "results" && prediction && (

          <motion.main
            key="results"

            className="results-page"

            initial={{
              opacity: 0,
              y: 25,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            exit={{
              opacity: 0,
              y: -25,
            }}

            transition={{
              duration: 0.5,
            }}
          >


            {/* RESULTS HEADER */}

            <div className="results-header">

              <button
                className="back-button"
                onClick={goHome}
              >

                <ChevronLeft size={18} />

                Home

              </button>


              <div className="results-brand">

                <div className="assessment-icon">

                  <HeartPulse size={24} />

                </div>

                <div>

                  <p>
                    HEARTWISE ASSESSMENT
                  </p>

                  <h2>
                    Your results are ready
                  </h2>

                </div>

              </div>

            </div>


            {/* RESULTS INTRO */}

            <div className="results-intro">

              <div className="eyebrow">

                <Sparkles size={15} />

                AI-POWERED ASSESSMENT

              </div>


              <h1>

                Here's what our model

                <span>
                  {" "}found.
                </span>

              </h1>


              <p>

                Your cardiovascular indicators have been
                evaluated using our trained machine learning model.

              </p>

            </div>


            {/* =================================================
                MAIN RESULT CARD
            ================================================== */}

            <motion.section
              className={`result-card ${getRiskClass()}`}

              initial={{
                opacity: 0,
                scale: 0.95,
              }}

              animate={{
                opacity: 1,
                scale: 1,
              }}

              transition={{
                duration: 0.6,
                delay: 0.15,
              }}
            >


              {/* LEFT */}

              <div className="result-main">

                <div className="result-icon">

                  {prediction.prediction === 1 ? (

                    <HeartPulse size={34} />

                  ) : (

                    <ShieldCheck size={34} />

                  )}

                </div>


                <p className="result-label">
                  MODEL ASSESSMENT
                </p>


                <h2>

                  {prediction.prediction === 1

                    ? "Heart Disease Detected"

                    : "No Heart Disease Detected"

                  }

                </h2>


                <p className="result-description">

                  {prediction.prediction === 1

                    ? "The model identified patterns in the provided indicators that are associated with heart disease."

                    : "The model did not identify patterns in the provided indicators that are associated with heart disease."

                  }

                </p>

              </div>


              {/* RIGHT — PROBABILITY */}

              <div className="probability-section">

                <div className="probability-circle">

                  <motion.div
                    className="probability-value"

                    initial={{
                      opacity: 0,
                      scale: 0.5,
                    }}

                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}

                    transition={{
                      duration: 0.7,
                      delay: 0.4,
                    }}
                  >

                    {Math.round(
                      prediction.probability * 100
                    )}

                    <span>%</span>

                  </motion.div>


                  <div className="probability-caption">
                    estimated probability
                  </div>

                </div>


                <div className="risk-label">

                  {getRiskLabel()}

                </div>

              </div>

            </motion.section>


            {/* =================================================
                SHAP EXPLANATION SECTION
            ================================================== */}

            {getExplanations().length > 0 && (

              <motion.section
                className="shap-section"

                initial={{
                  opacity: 0,
                  y: 30,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                transition={{
                  duration: 0.6,
                  delay: 0.3,
                }}
              >

                {/* SHAP HEADER */}

                <div className="shap-header">

                  <div>

                    <div className="eyebrow">

                      <Sparkles size={15} />

                      EXPLAINABLE AI

                    </div>


                    <h2>
                      What influenced your result?
                    </h2>


                    <p>

                      These are the factors that had the
                      strongest influence on the model's
                      prediction for this assessment.

                    </p>

                  </div>


                  <div className="shap-badge">

                    <Brain size={18} />

                    Model Explanation

                  </div>

                </div>


                {/* SHAP CARDS */}

                <div className="shap-list">

                  {getExplanations().map(
                    (item, index) => {

                      const positive =
                        item.shap_value > 0;

                      const width =
                        getShapWidth(
                          item.shap_value
                        );

                      const featureName =
                        getFeatureLabel(
                          item.feature
                        );

                      const detail =
                        getFeatureDetail(
                          item.feature
                        );

                      return (

                        <motion.div
                          className="shap-item"

                          key={`${item.feature}-${index}`}

                          initial={{
                            opacity: 0,
                            x: -20,
                          }}

                          animate={{
                            opacity: 1,
                            x: 0,
                          }}

                          transition={{
                            duration: 0.45,
                            delay:
                              0.45 +
                              index * 0.08,
                          }}
                        >

                          {/* TOP ROW */}

                          <div className="shap-item-top">

                            <div className="shap-feature">

                              <div
                                className={`shap-icon ${
                                  positive
                                    ? "shap-positive"
                                    : "shap-negative"
                                }`}
                              >

                                {positive ? (
                                  <ArrowRight
                                    size={16}
                                  />
                                ) : (
                                  <ArrowRight
                                    size={16}
                                  />
                                )}

                              </div>


                              <div>

                                <strong>
                                  {featureName}
                                </strong>


                                {detail && (

                                  <span>
                                    {detail}
                                  </span>

                                )}

                              </div>

                            </div>


                            <div
                              className={`shap-impact ${
                                positive
                                  ? "positive"
                                  : "negative"
                              }`}
                            >

                              {positive
                                ? "Increases risk"
                                : "Decreases risk"
                              }

                            </div>

                          </div>


                          {/* BAR */}

                          <div className="shap-bar-track">

                            <motion.div
                              className={`shap-bar ${
                                positive
                                  ? "bar-positive"
                                  : "bar-negative"
                              }`}

                              initial={{
                                width: 0,
                              }}

                              animate={{
                                width: `${width}%`,
                              }}

                              transition={{
                                duration: 0.8,
                                delay:
                                  0.5 +
                                  index * 0.08,
                                ease: "easeOut",
                              }}
                            />

                          </div>


                          {/* BOTTOM */}

                          <div className="shap-item-bottom">

                            <span>
                              Model contribution
                            </span>

                            <strong
                              className={
                                positive
                                  ? "positive-text"
                                  : "negative-text"
                              }
                            >

                              {positive
                                ? "+"
                                : ""
                              }

                              {item.shap_value.toFixed(4)}

                            </strong>

                          </div>

                        </motion.div>

                      );

                    }
                  )}

                </div>


                {/* SHAP EXPLANATION */}

                <div className="shap-note">

                  <Sparkles size={18} />

                  <p>

                    <strong>
                      How to read this:
                    </strong>{" "}

                    A positive contribution pushes the
                    model toward heart disease, while a
                    negative contribution pushes it away.
                    Larger absolute values indicate a
                    stronger influence on the model output.

                  </p>

                </div>

              </motion.section>

            )}


            {/* =================================================
                RESULT INFORMATION GRID
            ================================================== */}

            <div className="result-info-grid">


              {/* MACHINE LEARNING */}

              <motion.div
                className="result-info-card"

                initial={{
                  opacity: 0,
                  y: 20,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                transition={{
                  delay: 0.7,
                }}
              >

                <div className="info-icon">

                  <Brain size={22} />

                </div>


                <div>

                  <h3>
                    Machine Learning
                  </h3>

                  <p>

                    This result was generated by the
                    trained Random Forest classification
                    pipeline developed for this project.

                  </p>

                </div>

              </motion.div>


              {/* PROBABILITY */}

              <motion.div
                className="result-info-card"

                initial={{
                  opacity: 0,
                  y: 20,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                transition={{
                  delay: 0.8,
                }}
              >

                <div className="info-icon">

                  <Gauge size={22} />

                </div>


                <div>

                  <h3>
                    What does the percentage mean?
                  </h3>

                  <p>

                    The percentage represents the model's
                    estimated probability for class 1
                    (heart disease) based on the supplied
                    indicators.

                  </p>

                </div>

              </motion.div>


              {/* PRIVACY */}

              <motion.div
                className="result-info-card"

                initial={{
                  opacity: 0,
                  y: 20,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                transition={{
                  delay: 0.9,
                }}
              >

                <div className="info-icon">

                  <ShieldCheck size={22} />

                </div>


                <div>

                  <h3>
                    Data Privacy
                  </h3>

                  <p>

                    This local demonstration sends your
                    assessment directly to the locally running
                    prediction API.

                  </p>

                </div>

              </motion.div>

            </div>


            {/* =================================================
                DISCLAIMER
            ================================================== */}

            <div className="result-disclaimer">

              <AlertCircle size={20} />

              <div>

                <strong>
                  Important
                </strong>

                <p>

                  HeartWise is an educational machine learning
                  project and is not a medical diagnostic tool.
                  This result should not be used as a substitute
                  for professional medical advice.

                </p>

              </div>

            </div>


            {/* =================================================
                ACTIONS
            ================================================== */}

            <div className="result-actions">

              <button
                className="primary-button"
                onClick={startNewAssessment}
              >

                <RotateCcw size={18} />

                Take Another Assessment

              </button>


              <button
                className="secondary-button"
                onClick={goHome}
              >

                Return Home

              </button>

            </div>


            {/* FOOTER */}

            <footer>

              <span>
                © 2026 HeartWise
              </span>

              <span>
                AI-assisted risk assessment · Not a medical diagnosis
              </span>

            </footer>

          </motion.main>

        )}

      </AnimatePresence>

    </div>
  );
}


export default App;