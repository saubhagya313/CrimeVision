import axios from 'axios';
import AuditLog from '../models/AuditLog.js';
import { extractForensicEntities, calculateHeuristicRisk } from '../utils/iocExtractor.js';

/**
 * @desc    Run real-time forensic threat classification & entity extraction
 * @route   POST /api/analysis/scan
 * @access  Private
 */
export const runTextAnalysis = async (req, res, next) => {
  try {
    const { text, caseId, analysisType } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please provide text content to analyze.',
      });
    }

    // 1. Extract forensic entities (URLs, Phones, UPI IDs, Amounts)
    const entities = extractForensicEntities(text);
    const heuristics = calculateHeuristicRisk(text, entities);

    let modelPrediction = null;
    let predictedCategory = 'Suspicious Cyber Activity';
    let pythonConfidence = null;

    // 2. Attempt calling the Python FastAPI ML microservice (if running on port 8000)
    const aiUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    try {
      const pyResponse = await axios.post(
        `${aiUrl}/api/predict`,
        { text },
        { timeout: 2500 }
      );
      if (pyResponse.data) {
        modelPrediction = pyResponse.data;
        predictedCategory = pyResponse.data.category || predictedCategory;
        pythonConfidence = pyResponse.data.confidence;
      }
    } catch {
      // Python service offline; fallback to heuristic categorization
      const lower = text.toLowerCase();
      if (entities.some((e) => e.type === 'UPI_ID') || /upi|pin|qr|gpay|phonepe/i.test(lower)) {
        predictedCategory = 'UPI_Fraud';
      } else if (entities.some((e) => e.type === 'URL') || /http|login|otp|password/i.test(lower)) {
        predictedCategory = 'Phishing_Scam';
      } else if (/crypto|return|roi|profit|arbitrage|invest/i.test(lower)) {
        predictedCategory = 'Investment_Scam';
      } else if (/job|earn|telegram|daily income|typing/i.test(lower)) {
        predictedCategory = 'Job_Offer_Scam';
      } else if (/cbi|police|aadhaar|electricity|customs/i.test(lower)) {
        predictedCategory = 'KYC_Impersonation';
      } else {
        predictedCategory = 'Legitimate_Message';
      }
    }

    const finalRiskScore = pythonConfidence ? Math.round(pythonConfidence * 100) : heuristics.riskScore;
    let finalRiskLevel = 'Low';
    if (finalRiskScore >= 85) finalRiskLevel = 'Critical';
    else if (finalRiskScore >= 65) finalRiskLevel = 'High';
    else if (finalRiskScore >= 40) finalRiskLevel = 'Medium';

    // Forensic audit log
    await AuditLog.create({
      action: 'AI_ANALYSIS_EXECUTED',
      performedBy: req.user?._id,
      userName: req.user?.name || 'Investigator',
      caseId: caseId || null,
      ipAddress: req.ip || '127.0.0.1',
      details: `Executed AI threat analysis. Detected: ${predictedCategory} (Risk: ${finalRiskScore}/100 - ${finalRiskLevel})`,
    }).catch(() => {});

    res.status(200).json({
      success: true,
      data: {
        analysisType: analysisType || 'Cyber Threat Detection',
        caseId: caseId || null,
        scannedDate: new Date().toISOString(),
        predictedCategory,
        riskScore: finalRiskScore,
        riskLevel: finalRiskLevel,
        extractedEntities: entities,
        indicators: heuristics.indicators,
        entitiesCount: entities.length,
        summary: `Automated forensic scan completed. Categorized threat as '${predictedCategory}' with risk rating ${finalRiskLevel} (${finalRiskScore}/100). Extracted ${entities.length} forensic entities.`,
        modelEngine: modelPrediction ? 'Python FastAPI (TF-IDF + LogisticRegression)' : 'Heuristic Engine (Rule-based NLP)',
      },
    });
  } catch (error) {
    next(error);
  }
};
