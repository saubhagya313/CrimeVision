import crypto from 'crypto';
import fs from 'fs';
import Evidence from '../models/Evidence.js';
import Case from '../models/Case.js';
import AuditLog from '../models/AuditLog.js';
import { extractForensicEntities, calculateHeuristicRisk } from '../utils/iocExtractor.js';

/**
 * @desc    Get all evidence with filters
 * @route   GET /api/evidence
 * @access  Private
 */
export const getEvidence = async (req, res, next) => {
  try {
    const { caseId, fileType, riskLevel } = req.query;
    const query = {};

    if (caseId) query.caseId = caseId;
    if (fileType && fileType !== 'All') query.fileType = fileType;
    if (riskLevel && riskLevel !== 'All') query.riskLevel = riskLevel;

    const evidence = await Evidence.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: evidence.length,
      data: evidence,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single evidence by ID
 * @route   GET /api/evidence/:id
 * @access  Private
 */
export const getEvidenceById = async (req, res, next) => {
  try {
    const item = await Evidence.findOne({
      $or: [{ evidenceId: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }],
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Evidence item not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload digital evidence file, compute SHA-256 integrity hash & extract IOCs
 * @route   POST /api/evidence/upload
 * @access  Private
 */
export const uploadEvidence = async (req, res, next) => {
  try {
    const file = req.file;
    const { caseId, fileType, notes, rawText } = req.body;

    if (!caseId) {
      return res.status(400).json({
        success: false,
        message: 'Case ID is required to associate evidence.',
      });
    }

    // Generate unique evidence ID: EVD-XXXX
    const count = await Evidence.countDocuments();
    const evidenceId = `EVD-${String(count + 1).padStart(4, '0')}`;

    let sha256Hash = '';
    let fileSizeStr = '0 KB';
    let fileName = 'forensic_text_artifact.txt';
    let mimeType = 'text/plain';

    if (file) {
      fileName = file.filename;
      mimeType = file.mimetype;
      fileSizeStr = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

      // Calculate cryptographic SHA-256 hash of evidence file
      const fileBuffer = fs.readFileSync(file.path);
      const hashSum = crypto.createHash('sha256');
      hashSum.update(fileBuffer);
      sha256Hash = `sha256:${hashSum.digest('hex')}`;
    } else if (rawText) {
      // Calculate hash of raw text
      const hashSum = crypto.createHash('sha256');
      hashSum.update(rawText);
      sha256Hash = `sha256:${hashSum.digest('hex')}`;
      fileSizeStr = `${Buffer.byteLength(rawText, 'utf8')} Bytes`;
      fileName = `text-artifact-${evidenceId}.txt`;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide either an evidence file or raw text content.',
      });
    }

    // Run Forensic Entity & IOC Extraction
    const textToScan = rawText || `Digital evidence file: ${fileName} uploaded for case ${caseId}.`;
    const extractedEntities = extractForensicEntities(textToScan);
    const { riskScore, riskLevel, indicators } = calculateHeuristicRisk(textToScan, extractedEntities);

    const newEvidence = await Evidence.create({
      evidenceId,
      caseId,
      fileName,
      originalName: file ? file.originalname : fileName,
      fileType: fileType || 'Screenshot',
      mimeType,
      fileSize: fileSizeStr,
      fileUrl: file ? `/uploads/${file.filename}` : '',
      sha256Hash,
      processingStatus: 'Analyzed',
      riskLevel,
      riskScore,
      ocrText: rawText || '',
      extractedEntities,
      fraudIndicators: indicators,
      uploadedBy: req.user?._id,
      uploaderName: req.user?.name || 'Investigator',
      notes: notes || '',
    });

    // Increment case evidence count
    await Case.findOneAndUpdate({ caseId }, { $inc: { evidenceCount: 1 } });

    // Forensic audit log
    await AuditLog.create({
      action: 'EVIDENCE_UPLOADED',
      performedBy: req.user?._id,
      userName: req.user?.name || 'Investigator',
      caseId,
      evidenceId,
      ipAddress: req.ip || '127.0.0.1',
      details: `Uploaded evidence ${evidenceId} (${fileName}) - SHA256: ${sha256Hash.substring(0, 20)}...`,
    }).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'Evidence securely ingested with cryptographic integrity hash.',
      data: newEvidence,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete evidence record
 * @route   DELETE /api/evidence/:id
 * @access  Private
 */
export const deleteEvidence = async (req, res, next) => {
  try {
    const item = await Evidence.findOne({
      $or: [{ evidenceId: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }],
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Evidence record not found.',
      });
    }

    await Evidence.findByIdAndDelete(item._id);
    await Case.findOneAndUpdate({ caseId: item.caseId }, { $inc: { evidenceCount: -1 } });

    res.status(200).json({
      success: true,
      message: 'Evidence deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
