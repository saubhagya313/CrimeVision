import axios from 'axios';
import Analysis from '../models/Analysis.js';
import AuditLog from '../models/AuditLog.js';
import {
  extractForensicEntities,
  calculateHeuristicRisk,
  generateTimelineFromText,
} from '../utils/iocExtractor.js';
import { sendForensicSummaryEmail } from '../utils/emailService.js';

/**
 * @desc    Run real-time threat classification, entity extraction & duplicate check
 * @route   POST /api/analysis/scan
 * @access  Private (Citizen / Admin)
 */
export const runTextAnalysis = async (req, res, next) => {
  try {
    const { text, sourceType, fileName, fileUrl, fileHash, imageQuality, forceReScan } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid digital evidence text to analyze.',
      });
    }

    const cleanText = text.trim();

    // 1. Duplicate Evidence Detection using SHA-256 fileHash
    if (fileHash && !forceReScan) {
      const existingAnalysis = await Analysis.findOne({
        userId: req.user._id,
        fileHash: fileHash.trim(),
      });

      if (existingAnalysis) {
        return res.status(200).json({
          success: true,
          isDuplicate: true,
          message: `Duplicate Evidence Detected: This exact file was previously analyzed under Reference ID ${existingAnalysis.analysisId}.`,
          data: existingAnalysis,
        });
      }
    }

    // 2. Extract forensic entities
    const entities = extractForensicEntities(cleanText);
    const heuristics = calculateHeuristicRisk(cleanText, entities);
    const sourceLabel = fileName ? fileName : (sourceType || 'Digital Evidence');
    const timeline = generateTimelineFromText(cleanText, entities, sourceLabel);

    let modelPrediction = null;
    let predictedCategory = 'Potential Cyber Fraud';
    let mlConfidence = 85;

    // 3. Attempt calling Python FastAPI ML microservice
    const aiUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    try {
      const pyResponse = await axios.post(
        `${aiUrl}/api/predict`,
        { text: cleanText },
        { timeout: 2500 }
      );
      if (pyResponse.data) {
        modelPrediction = pyResponse.data;
        if (pyResponse.data.category) {
          predictedCategory = pyResponse.data.category.replace(/_/g, ' ');
        }
        if (pyResponse.data.confidence) {
          mlConfidence = Math.round(pyResponse.data.confidence * 100);
        }
      }
    } catch {
      // Heuristic category mapping fallback
      const lower = cleanText.toLowerCase();
      if (entities.some((e) => e.type === 'UPI_ID') || /upi|pin|qr|gpay|phonepe|paytm/i.test(lower)) {
        predictedCategory = 'UPI / Payment Fraud';
      } else if (entities.some((e) => e.type === 'URL') || /http|login|otp|password|verify/i.test(lower)) {
        predictedCategory = 'Phishing & Credential Theft';
      } else if (/crypto|return|roi|profit|arbitrage|invest|usdt/i.test(lower)) {
        predictedCategory = 'Investment / Crypto Scam';
      } else if (/job|earn|telegram|daily income|typing|task/i.test(lower)) {
        predictedCategory = 'Job Offer / Task Scam';
      } else if (/cbi|police|aadhaar|electricity|customs|arrest/i.test(lower)) {
        predictedCategory = 'Digital Arrest / Impersonation Scam';
      } else if (heuristics.riskLevel === 'Low') {
        predictedCategory = 'No Significant Suspicious Indicators';
      } else {
        predictedCategory = 'Suspicious Cyber Activity';
      }
    }

    // Final Risk Level
    let finalRiskScore = modelPrediction ? Math.round(mlConfidence) : heuristics.riskScore;
    if (heuristics.indicators.length === 0 && finalRiskScore > 35) {
      finalRiskScore = 15;
    }

    let finalRiskLevel = heuristics.riskLevel;
    if (finalRiskScore >= 75) finalRiskLevel = 'Critical';
    else if (finalRiskScore >= 50) finalRiskLevel = 'High';
    else if (finalRiskScore >= 30) finalRiskLevel = 'Medium';
    else finalRiskLevel = 'Low';

    if (finalRiskLevel === 'Low') {
      predictedCategory = 'No Significant Suspicious Indicators';
    }

    // Standardized Reference ID format: CV-ANL-YYYY-XXXX
    const count = await Analysis.countDocuments();
    const year = new Date().getFullYear();
    const analysisId = `CV-ANL-${year}-${String(count + 1).padStart(4, '0')}`;

    // 4. Save Analysis Record
    const newAnalysis = await Analysis.create({
      analysisId,
      userId: req.user._id,
      userName: req.user.name,
      sourceType: sourceType || 'Suspicious Text',
      fileName: fileName || '',
      fileUrl: fileUrl || '',
      fileHash: fileHash || '',
      imageQuality: imageQuality || { isBlurry: false, resolution: '', qualityWarning: '' },
      extractedText: cleanText,
      predictedCategory,
      riskLevel: finalRiskLevel,
      riskScore: finalRiskScore,
      confidence: mlConfidence || 94,
      entities,
      indicators: heuristics.indicators,
      timeline,
      modelEngine: modelPrediction ? 'CrimeVision ML Model (TF-IDF + LogisticRegression)' : 'CrimeVision Heuristic NLP Engine',
    });

    // 5. Audit Log
    await AuditLog.create({
      action: 'AI_ANALYSIS_EXECUTED',
      performedBy: req.user._id,
      userName: req.user.name,
      userRole: req.user.role || 'User',
      ipAddress: req.ip || '127.0.0.1',
      details: `Executed analysis [${analysisId}]. Risk: ${finalRiskLevel} (${finalRiskScore}%), Category: ${predictedCategory}`,
    }).catch(() => {});

    // Immediate Safety Guidance
    const safetyGuidance =
      finalRiskLevel === 'High' || finalRiskLevel === 'Critical'
        ? [
            'Do NOT send any money, scan QR codes, or enter your UPI PIN.',
            'Do NOT share OTPs, passwords, or bank account credentials with anyone.',
            'Do NOT click suspicious links or download external APK applications.',
            'Immediately preserve all chat logs, screenshots, and transaction UTR numbers.',
            'Call the National Cybercrime Helpline 1930 immediately or visit cybercrime.gov.in.',
          ]
        : [
            'No significant suspicious indicators associated with known fraud patterns were identified in this sample.',
            'Always double-check sender email handles and verify official websites before making online payments.',
            'Never share OTPs or enter UPI PINs on prompts to receive money.',
          ];

    // 6. Automated Forensic Summary Email Dispatch to Registered User
    let emailStatus = null;
    if (req.user && req.user.email) {
      emailStatus = await sendForensicSummaryEmail({
        recipientEmail: req.user.email,
        recipientName: req.user.name,
        recipientAddress: req.user.address || req.user.city || '',
        analysisId: newAnalysis.analysisId,
        predictedCategory: newAnalysis.predictedCategory,
        riskLevel: newAnalysis.riskLevel,
        riskScore: newAnalysis.riskScore,
        confidence: newAnalysis.confidence,
        extractedEntities: entities,
        indicators: heuristics.indicators,
        safetyGuidance,
        userId: req.user._id,
      }).catch((err) => {
        console.warn('Forensic email dispatch warning:', err.message);
        return null;
      });
    }

    res.status(201).json({
      success: true,
      isDuplicate: false,
      message: emailStatus
        ? `Evidence analysis completed & Forensic Summary emailed to ${req.user.email}.`
        : 'Evidence analysis completed successfully.',
      emailSent: !!emailStatus,
      emailRecipient: req.user?.email || '',
      data: {
        ...newAnalysis.toObject(),
        safetyGuidance,
        emailSent: !!emailStatus,
        emailRecipient: req.user?.email || '',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit user feedback on model prediction accuracy
 * @route   POST /api/analysis/:id/feedback
 * @access  Private
 */
export const submitAnalysisFeedback = async (req, res, next) => {
  try {
    const { isCorrect, userLabeledCategory, comment } = req.body;

    const analysis = await Analysis.findOne({
      $or: [
        { analysisId: req.params.id },
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
      ],
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis record not found.',
      });
    }

    analysis.feedback = {
      isCorrect: Boolean(isCorrect),
      userLabeledCategory: userLabeledCategory || '',
      comment: comment || '',
      submittedAt: new Date(),
    };

    await analysis.save();

    // Audit log
    await AuditLog.create({
      action: 'FEEDBACK_SUBMITTED',
      performedBy: req.user._id,
      userName: req.user.name,
      userRole: req.user.role || 'User',
      ipAddress: req.ip || '127.0.0.1',
      details: `User submitted feedback for [${analysis.analysisId}]: ${isCorrect ? 'Accurate' : 'Inaccurate'} (Label: ${userLabeledCategory || 'N/A'})`,
    }).catch(() => {});

    res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully. Thank you for helping evaluate CrimeVision models.',
      data: analysis.feedback,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's previous analyses
 * @route   GET /api/analysis/my-analyses
 * @access  Private (Citizen)
 */
export const getMyAnalyses = async (req, res, next) => {
  try {
    const { riskLevel, search } = req.query;
    const query = { userId: req.user._id };

    if (riskLevel && riskLevel !== 'All') {
      query.riskLevel = riskLevel;
    }

    if (search) {
      query.$or = [
        { predictedCategory: { $regex: search, $options: 'i' } },
        { analysisId: { $regex: search, $options: 'i' } },
        { extractedText: { $regex: search, $options: 'i' } },
      ];
    }

    const analyses = await Analysis.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: analyses.length,
      data: analyses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single analysis by ID
 * @route   GET /api/analysis/:id
 * @access  Private
 */
export const getAnalysisById = async (req, res, next) => {
  try {
    const analysis = await Analysis.findOne({
      $or: [
        { analysisId: req.params.id },
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
      ],
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis record not found.',
      });
    }

    if (
      req.user.role !== 'Admin' &&
      analysis.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
      });
    }

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete analysis record
 * @route   DELETE /api/analysis/:id
 * @access  Private
 */
export const deleteAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findOne({
      $or: [
        { analysisId: req.params.id },
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
      ],
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis record not found.',
      });
    }

    if (
      req.user.role !== 'Admin' &&
      analysis.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
      });
    }

    await Analysis.findByIdAndDelete(analysis._id);

    res.status(200).json({
      success: true,
      message: 'Analysis record deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get aggregate analyses for Admin monitoring (Privacy Protected)
 * @route   GET /api/analysis/admin/all
 * @access  Private (Admin only)
 */
export const getAdminAnalyses = async (req, res, next) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin authorization required.',
      });
    }

    const analyses = await Analysis.find()
      .select('analysisId userId userName sourceType fileName predictedCategory riskLevel riskScore confidence entities feedback createdAt')
      .sort({ createdAt: -1 })
      .limit(100);

    const totalAnalyses = await Analysis.countDocuments();
    const highRiskCount = await Analysis.countDocuments({ riskLevel: { $in: ['High', 'Critical'] } });
    const lowRiskCount = await Analysis.countDocuments({ riskLevel: 'Low' });

    res.status(200).json({
      success: true,
      totalAnalyses,
      highRiskCount,
      lowRiskCount,
      data: analyses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Manual re-send or trigger forensic summary email by analysis ID
 * @route   POST /api/analysis/:id/send-email
 * @access  Private
 */
export const emailAnalysisSummary = async (req, res, next) => {
  try {
    const analysis = await Analysis.findOne({
      $or: [
        { analysisId: req.params.id },
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
      ],
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis record not found.',
      });
    }

    if (
      req.user.role !== 'Admin' &&
      analysis.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
      });
    }

    const recipientEmail = req.user.email;
    const recipientName = req.user.name;
    const recipientAddress = req.user.address || req.user.city || '';

    const safetyGuidance =
      analysis.riskLevel === 'High' || analysis.riskLevel === 'Critical'
        ? [
            'Do NOT send any money, scan QR codes, or enter your UPI PIN.',
            'Do NOT share OTPs, passwords, or bank account credentials with anyone.',
            'Do NOT click suspicious links or download external APK applications.',
            'Immediately preserve all chat logs, screenshots, and transaction UTR numbers.',
            'Call the National Cybercrime Helpline 1930 immediately or visit cybercrime.gov.in.',
          ]
        : [
            'No significant suspicious indicators associated with known fraud patterns were identified in this sample.',
            'Always double-check sender email handles and verify official websites before making online payments.',
            'Never share OTPs or enter UPI PINs on prompts to receive money.',
          ];

    const emailStatus = await sendForensicSummaryEmail({
      recipientEmail,
      recipientName,
      recipientAddress,
      analysisId: analysis.analysisId,
      predictedCategory: analysis.predictedCategory,
      riskLevel: analysis.riskLevel,
      riskScore: analysis.riskScore,
      confidence: analysis.confidence,
      extractedEntities: analysis.entities || [],
      indicators: analysis.indicators || [],
      safetyGuidance,
      userId: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: `Forensic Summary & Threat Analysis Report successfully emailed to ${recipientEmail}.`,
      deliveryDetails: emailStatus?.deliveryDetails || null,
    });
  } catch (error) {
    next(error);
  }
};
