import Report from '../models/Report.js';
import Case from '../models/Case.js';
import Evidence from '../models/Evidence.js';
import AuditLog from '../models/AuditLog.js';

/**
 * @desc    Get all generated forensic reports
 * @route   GET /api/reports
 * @access  Private
 */
export const getReports = async (req, res, next) => {
  try {
    const { caseId } = req.query;
    const query = {};
    if (caseId) query.caseId = caseId;

    const reports = await Report.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single report by ID
 * @route   GET /api/reports/:id
 * @access  Private
 */
export const getReportById = async (req, res, next) => {
  try {
    const report = await Report.findOne({
      $or: [{ reportId: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }],
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Generate a court-ready forensic report from case and evidence data
 * @route   POST /api/reports/generate
 * @access  Private
 */
export const generateReport = async (req, res, next) => {
  try {
    const { caseId, reportType, findings, summary, recommendedActions } = req.body;

    if (!caseId) {
      return res.status(400).json({
        success: false,
        message: 'Please specify a target case ID to generate a report.',
      });
    }

    const caseItem = await Case.findOne({ caseId });
    if (!caseItem) {
      return res.status(404).json({
        success: false,
        message: `Case ${caseId} does not exist.`,
      });
    }

    const evidenceList = await Evidence.find({ caseId });

    const count = await Report.countDocuments();
    const year = new Date().getFullYear();
    const reportId = `REP-${year}-${String(count + 1).padStart(3, '0')}`;

    const defaultSummary =
      summary ||
      `Forensic Investigation Report for Case ${caseId}: "${caseItem.title}". Synthesizes ${evidenceList.length} evidence artifacts, threat classification (${caseItem.riskLevel} Risk), and suspect tracking IOCs.`;

    const legalSections = [
      {
        statute: 'Information Technology Act, 2000 (Amended 2008)',
        section: 'Section 66D',
        description: 'Punishment for cheating by personation by using computer resource or communication device.',
      },
      {
        statute: 'Bharatiya Nyaya Sanhita (BNS), 2023 / IPC 420',
        section: 'Section 318(4)',
        description: 'Cheating and dishonestly inducing delivery of property.',
      },
      {
        statute: 'Information Technology Act, 2000',
        section: 'Section 43',
        description: 'Penalty and compensation for damage to computer, computer system, etc.',
      },
    ];

    const newReport = await Report.create({
      reportId,
      caseId,
      caseTitle: caseItem.title,
      reportType: reportType || 'Complete Case Report',
      author: req.user?.name || 'Investigating Officer',
      generatedBy: req.user?._id,
      status: 'Generated',
      summary: defaultSummary,
      findings: findings || [
        { category: 'Threat Level', detail: `Assessed as ${caseItem.riskLevel} (${caseItem.riskScore}/100)`, severity: caseItem.riskLevel },
        { category: 'Evidence Ingestion', detail: `${evidenceList.length} artifacts cryptographically verified with SHA-256`, severity: 'Info' },
      ],
      legalSections,
      recommendedActions: recommendedActions || [
        'Serve formal Section 91 CrPC notice to beneficiary bank for immediate freeze of flagged UPI VPAs.',
        'Request CDR/IPDR logs from telecom providers for extracted mobile lines.',
        'Issue domain takedown request to registrar for identified phishing endpoints.',
      ],
    });

    // Audit log
    await AuditLog.create({
      action: 'REPORT_GENERATED',
      performedBy: req.user?._id,
      userName: req.user?.name || 'Investigator',
      caseId,
      ipAddress: req.ip || '127.0.0.1',
      details: `Generated forensic report ${reportId} for case ${caseId}`,
    }).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'Forensic report compiled successfully.',
      data: newReport,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete report
 * @route   DELETE /api/reports/:id
 * @access  Private
 */
export const deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findOne({
      $or: [{ reportId: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }],
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found.',
      });
    }

    await Report.findByIdAndDelete(report._id);

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
