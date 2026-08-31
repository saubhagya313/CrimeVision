# CrimeVision AI - ML Training & Inference Engine

This directory contains a complete, working Machine Learning pipeline designed for **Cyber Crime & Digital Forensic Text Classification, Fraud Detection, and Entity Extraction**.

---

## 📁 Folder Structure

```
ai_model/
│
├── dataset/
│   └── cybercrime_training_data.csv   # Labeled dataset for cybercrime threats
├── saved_models/
│   └── crimevision_pipeline.joblib    # Serialized trained model (generated after training)
├── train.py                           # Model training & evaluation script
├── predict.py                         # Interactive testing & CLI prediction script
├── app.py                             # FastAPI REST API to serve live predictions
├── requirements.txt                   # Python library dependencies
└── README.md                          # Documentation & Viva Q&A Guide
```

---

## 📊 Dataset Details

The dataset ([`cybercrime_training_data.csv`](file:///c:/Users/saubh/OneDrive/Documents/project_folder/ai_model/dataset/cybercrime_training_data.csv)) includes realistic forensic text messages across **6 threat categories**:

1. **`UPI_Fraud`**: Fake cashbacks, QR code PIN phishing, money refund tricks.
2. **`Phishing_Scam`**: Malicious URLs, fake banking login portals, lottery links.
3. **`Investment_Scam`**: High-yield Ponzi schemes, crypto arbitrage bots, guaranteed 300% return claims.
4. **`Job_Offer_Scam`**: YouTube video like/typing job scams with upfront registration fees.
5. **`KYC_Impersonation`**: Fake police/CBI notices, electricity disconnection threats, SIM block scams.
6. **`Legitimate_Message`**: Normal banking alerts, Swiggy/Zomato updates, personal chats.

---

## 🚀 Quickstart Guide

### 1. Install Dependencies
Open your terminal in the `ai_model` directory and run:
```bash
pip install -r requirements.txt
```

### 2. Train the Model
Run the training script:
```bash
python train.py
```
**What happens:**
* Ingests and cleans dataset texts.
* Extracts NLP features via **TF-IDF Vectorization** (Unigrams & Bigrams).
* Trains a balanced **Logistic Regression Classifier**.
* Outputs training metrics (Accuracy, Precision, Recall, F1-Score).
* Saves the model pipeline into `saved_models/crimevision_pipeline.joblib`.

### 3. Test Predictions in CLI
```bash
python predict.py
```
You can type custom SMS, WhatsApp chats, or emails to see:
* Predicted Threat Category
* Risk Score (0 - 100) & Risk Level (`Low`, `Medium`, `High`, `Critical`)
* Extracted Forensic Entities (Phone numbers, UPI IDs, URLs, Amounts)

### 4. (Optional) Run the Live FastAPI Server
```bash
uvicorn app:app --reload --port 8000
```
API endpoint: `POST http://localhost:8000/api/predict`
Payload:
```json
{
  "text": "Dear user, you won Rs 25000 cashback! Scan QR code and enter UPI PIN to receive money: http://paytm-reward.xyz"
}
```

---

## 🎓 College Viva & Project Presentation Q&A

### Q1: What machine learning technique is used?
> **Answer:** We implemented **Natural Language Processing (NLP)** using a **TF-IDF (Term Frequency - Inverse Document Frequency)** vectorizer with n-grams (1-2) coupled with a **Multinomial Logistic Regression Classifier** with class weighting to handle multi-class cybercrime threat categorization.

### Q2: How is the Risk Score calculated?
> **Answer:** The risk score (0–100) is computed through a hybrid approach:
> 1. **Model Prediction Confidence** (statistical probability).
> 2. **Forensic Entity & Keyword Heuristics** (presence of suspicious UPI IDs, unverified URLs, urgent coercive keywords).

### Q3: Why is TF-IDF + Logistic Regression chosen over deep learning for this task?
> **Answer:** It provides high interpretability, low latency, requires no expensive GPU infrastructure, avoids overfitting on small/medium domain-specific forensic datasets, and is easy to deploy in production edge microservices.
