"""
CrimeVision - Interactive Prediction & Forensic Entity Extraction Script
College Project ML Demo

Usage:
  python predict.py
"""

import os
import re
import joblib

def extract_forensic_entities(text: str) -> dict:
    """Extract digital evidence tokens (URLs, UPI IDs, Phones, Amounts, Transaction IDs)."""
    entities = {
        'phones': re.findall(r'(?:\+91[\-\s]?)?[6-9]\d{9}', text),
        'upi_ids': re.findall(r'[\w.-]+@(?:okaxis|okhdfcbank|oksbi|paytm|ybl|axl|ibl|barodampay|upi)', text, re.IGNORECASE),
        'urls': re.findall(r'https?://[^\s<>"]+|www\.[^\s<>"]+', text),
        'amounts': re.findall(r'(?:Rs\.?|INR|₹)\s?[\d,]+(?:\.\d+)?', text, re.IGNORECASE),
        'keywords': []
    }
    
    # Forensic Indicator Keywords
    indicator_keywords = [
        ('UPI PIN Entry', ['upi pin', 'enter pin', '6 digit pin', 'scan qr']),
        ('Urgency Pressure', ['immediately', 'within 2 hours', 'urgent', 'blocked', 'arrest', 'fir']),
        ('Fake Prize / Refund', ['cashback', 'lottery', 'won', 'refund', 'lucky draw', 'reward points']),
        ('KYC Threat', ['kyc', 'aadhaar', 'sim card', 'disconnected', 'electricity bill']),
        ('High-Yield Ponzi', ['guaranteed', 'daily profit', '300%', 'arbitrage', 'deposit minimum'])
    ]
    
    lower_text = text.lower()
    for name, triggers in indicator_keywords:
        if any(trig in lower_text for trig in triggers):
            entities['keywords'].append(name)
            
    return entities

def clean_text(text: str) -> str:
    text = str(text).lower()
    text = re.sub(r'https?://\S+|www\.\S+', ' [URL] ', text)
    text = re.sub(r'\+?\d[\d -]{8,12}\d', ' [PHONE] ', text)
    text = re.sub(r'[\w.-]+@[\w.-]+', ' [UPI_OR_EMAIL] ', text)
    text = re.sub(r'[₹$]\s?\d+(?:,\d+)*(?:\.\d+)?', ' [AMOUNT] ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def analyze_message(model_data: dict, text: str) -> dict:
    pipeline = model_data['pipeline']
    cleaned = clean_text(text)
    
    # Prediction
    predicted_category = pipeline.predict([cleaned])[0]
    probabilities = pipeline.predict_proba([cleaned])[0]
    classes = pipeline.classes_
    
    confidence = float(max(probabilities))
    is_fraud = predicted_category != 'Legitimate_Message'
    
    # Calculate Forensic Risk Score (0 - 100)
    entities = extract_forensic_entities(text)
    base_risk = 0 if not is_fraud else int(confidence * 75)
    
    # Weight entity indicators
    if entities['upi_ids']: base_risk += 10
    if entities['urls']: base_risk += 10
    if entities['keywords']: base_risk += len(entities['keywords']) * 5
    
    risk_score = min(99, max(5, base_risk if is_fraud else int(confidence * 8)))
    
    if risk_score >= 80:
        risk_level = 'Critical'
    elif risk_score >= 60:
        risk_level = 'High'
    elif risk_score >= 35:
        risk_level = 'Medium'
    else:
        risk_level = 'Low'

    return {
        'text': text,
        'category': predicted_category,
        'is_fraud': is_fraud,
        'confidence_percentage': round(confidence * 100, 2),
        'risk_score': risk_score,
        'risk_level': risk_level,
        'extracted_entities': entities
    }

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, 'saved_models', 'crimevision_pipeline.joblib')

    if not os.path.exists(model_path):
        print(f"Error: Model not found at {model_path}")
        print("Please train the model first by running: `python train.py`")
        return

    model_data = joblib.load(model_path)
    print("=" * 65)
    print("  CRIMEVISION AI INFERENCE ENGINE LOADED")
    print(f"  Model Type: {model_data.get('model_type')}")
    print("=" * 65)

    sample_tests = [
        "Dear Customer, you won ₹25,000 cash reward. Scan QR & enter your UPI PIN to claim immediately: http://paytm-reward-claim.xyz",
        "Hi mom, I lost my phone, please send Rs 5000 urgently to mule992@paytm",
        "Your Swiggy order #98124 has been delivered. Enjoy your meal!",
        "SBI Alert: Your NetBanking is locked. Update KYC at http://sbi-retail-security.net"
    ]

    print("\n--- Running Sample Test Inferences ---")
    for idx, sample in enumerate(sample_tests, 1):
        result = analyze_message(model_data, sample)
        print(f"\n[Test #{idx}]")
        print(f"Input Text: \"{result['text']}\"")
        print(f"-> Predicted Threat : {result['category']}")
        print(f"-> Risk Assessment  : {result['risk_level']} (Risk Score: {result['risk_score']}/100)")
        print(f"-> Model Confidence : {result['confidence_percentage']}%")
        print(f"-> Entities Found   : {result['extracted_entities']}")
        print("-" * 60)

    print("\n[Interactive Mode] Type a message to test (or type 'exit' to quit):")
    while True:
        try:
            user_input = input("\nEnter forensic text: ").strip()
            if not user_input or user_input.lower() in ('exit', 'quit'):
                break
            res = analyze_message(model_data, user_input)
            print("\n[Analysis Output]")
            print(f" Threat Category   : {res['category']}")
            print(f" Fraud Risk Level  : {res['risk_level']} ({res['risk_score']}/100)")
            print(f" Model Confidence  : {res['confidence_percentage']}%")
            print(f" Extracted Evidence: {res['extracted_entities']}")
        except KeyboardInterrupt:
            break

if __name__ == '__main__':
    main()
