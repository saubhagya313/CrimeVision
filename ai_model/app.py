"""
CrimeVision - FastAPI Microservice Backend
Serves real-time inferences from the trained ML model for the CrimeVision Web App.

Run with:
  uvicorn app:app --reload --port 8000
"""

import os
import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from predict import analyze_message

app = FastAPI(
    title="CrimeVision AI Inference API",
    description="REST API for cyber crime text classification, entity extraction, and risk scoring.",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite default port 5173 / localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model container
model_container = {}

@app.on_event("startup")
def load_trained_model():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, 'saved_models', 'crimevision_pipeline.joblib')
    if os.path.exists(model_path):
        model_container['model'] = joblib.load(model_path)
        print(f"Loaded CrimeVision model from {model_path}")
    else:
        print("Warning: Model file not found. Please run `python train.py` first.")

class TextPayload(BaseModel):
    text: str
    case_id: str = "CV-2026-001"

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "model_loaded": "model" in model_container,
        "service": "CrimeVision AI Microservice"
    }

@app.post("/api/predict")
def predict_fraud(payload: TextPayload):
    if "model" not in model_container:
        raise HTTPException(
            status_code=503,
            detail="Model is not trained yet. Please run `python train.py` in the ai_model folder."
        )
    
    if not payload.text.strip():
        raise HTTPException(status_code=400, detail="Text field cannot be empty.")

    result = analyze_message(model_container['model'], payload.text)
    return {
        "success": True,
        "case_id": payload.case_id,
        "analysis": result
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
