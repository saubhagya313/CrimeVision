"""
CrimeVision - Cyber Crime & Fraud Detection Model Training Script
College Project ML Pipeline

This script:
1. Ingests the forensic text dataset (cybercrime_training_data.csv)
2. Extracts NLP features using TF-IDF Vectorization (unigrams + bigrams)
3. Trains a Multi-Class Classifier (Category detection) & Binary Classifier (Fraud vs Legitimate)
4. Evaluates performance (Accuracy, Precision, Recall, F1 Score, Confusion Matrix)
5. Saves the trained model pipeline to `saved_models/crimevision_pipeline.joblib`
"""

import os
import re
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix

def clean_text(text: str) -> str:
    """Preprocess text for NLP feature extraction."""
    text = str(text).lower()
    text = re.sub(r'https?://\S+|www\.\S+', ' [URL] ', text)
    text = re.sub(r'\+?\d[\d -]{8,12}\d', ' [PHONE] ', text)
    text = re.sub(r'[\w.-]+@[\w.-]+', ' [UPI_OR_EMAIL] ', text)
    text = re.sub(r'[₹$]\s?\d+(?:,\d+)*(?:\.\d+)?', ' [AMOUNT] ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def main():
    print("=" * 65)
    print("  CRIMEVISION FORENSICS - MACHINE LEARNING MODEL TRAINING")
    print("=" * 65)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(base_dir, 'dataset', 'cybercrime_training_data.csv')
    models_dir = os.path.join(base_dir, 'saved_models')
    os.makedirs(models_dir, exist_ok=True)

    # 1. Load Dataset
    print(f"\n[1/5] Loading training dataset from:\n      {dataset_path}")
    df = pd.read_csv(dataset_path)
    print(f"      Total records loaded: {len(df)}")
    print("      Class Distribution:")
    for cat, count in df['category'].value_counts().items():
        print(f"       - {cat:20s}: {count} samples")

    # 2. Text Preprocessing
    print("\n[2/5] Performing NLP Text Preprocessing & Token Normalization...")
    df['cleaned_text'] = df['text'].apply(clean_text)

    X = df['cleaned_text']
    y_category = df['category']
    y_fraud = df['is_fraud']

    # 3. Train/Test Split
    X_train, X_test, y_cat_train, y_cat_test, y_fraud_train, y_fraud_test = train_test_split(
        X, y_category, y_fraud, test_size=0.25, random_state=42, stratify=y_fraud
    )
    print(f"      Train Samples: {len(X_train)} | Test Samples: {len(X_test)}")

    # 4. Build and Train Category Classification Pipeline
    print("\n[3/5] Training TF-IDF + Logistic Regression Model for Threat Classification...")
    category_pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(
            ngram_range=(1, 2),
            sublinear_tf=True,
            max_features=2500,
            token_pattern=r'(?u)\b\w+\b|\[\w+\]'
        )),
        ('clf', LogisticRegression(C=2.5, max_iter=500, class_weight='balanced'))
    ])

    category_pipeline.fit(X_train, y_cat_train)

    # 5. Evaluate Model
    print("\n[4/5] Evaluating Model Performance on Test Data:")
    cat_preds = category_pipeline.predict(X_test)
    accuracy = accuracy_score(y_cat_test, cat_preds)
    print(f"      Test Accuracy: {accuracy * 100:.2f}%\n")
    print("      --- Detailed Classification Report ---")
    print(classification_report(y_cat_test, cat_preds, zero_division=0))

    # 6. Save Pipeline
    model_output_path = os.path.join(models_dir, 'crimevision_pipeline.joblib')
    joblib.dump({
        'pipeline': category_pipeline,
        'classes': category_pipeline.classes_.tolist(),
        'model_type': 'TF-IDF + LogisticRegression Multi-Class Classifier',
        'version': '1.0.0'
    }, model_output_path)

    print(f"\n[5/5] Trained Model Pipeline successfully saved to:\n      {model_output_path}")
    print("\n" + "=" * 65)
    print(" Training Complete! You can now run `python predict.py` to test.")
    print("=" * 65)

if __name__ == '__main__':
    main()
