import Case from '../models/Case.js';
import Evidence from '../models/Evidence.js';
import AuditLog from '../models/AuditLog.js';

/**
 * @desc    Get all cases with optional filtering & search
 * @route   GET /api/cases
 * @access  Private
 */
export const getCases = async (req, res, next) => {
  try {
    const { status, priority, riskLevel, search, caseType } = req.query;
    const query = {};

    if (status && status !== 'All') {
      if (status === 'High Risk') {
        query.riskLevel = { $in: ['High', 'Critical'] };
      } else {
        query.status = status;
      }
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    if (riskLevel && riskLevel !== 'All') {
      query.riskLevel = riskLevel;
    }

    if (caseType && caseType !== 'All') {
      query.caseType = caseType;
    }

    if (search) {
      query.$or = [
        { caseId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'victimInfo.name': { $regex: search, $options: 'i' } },
      ];
    }

    const cases = await Case.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: cases.length,
      data: cases,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single case details with linked evidence
 * @route   GET /api/cases/:id
 * @access  Private
 */
export const getCaseById = async (req, res, next) => {
  try {
    const caseItem = await Case.findOne({
      $or: [{ caseId: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }],
    }).populate('assignedOfficer', 'name email badgeNumber department');

    if (!caseItem) {
      return res.status(404).json({
        success: false,
        message: `Case '${req.params.id}' not found.`,
      });
    }

    // Also fetch associated evidence items
    const evidence = await Evidence.find({ caseId: caseItem.caseId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        ...caseItem.toObject(),
        evidence,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new cybercrime case
 * @route   POST /api/cases
 * @access  Private
 */
export const createCase = async (req, res, next) => {
  try {
    const {
      title,
      description,
      caseType,
      priority,
      status,
      lossAmount,
      victimName,
      victimPhone,
      victimEmail,
      victimAddress,
      victimBank,
      incidentDate,
      tags,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Case title and description are required.',
      });
    }

    // Generate unique sequential case ID: CV-YYYY-XXXX
    const count = await Case.countDocuments();
    const year = new Date().getFullYear();
    const caseId = `CV-${year}-${String(count + 1).padStart(3, '0')}`;

    const riskLevel = priority === 'Critical' ? 'Critical' : priority === 'High' ? 'High' : 'Medium';
    const riskScore = priority === 'Critical' ? 95 : priority === 'High' ? 82 : 60;

    const newCase = await Case.create({
      caseId,
      title,
      description,
      caseType: caseType || 'UPI / Payment Fraud',
      priority: priority || 'High',
      riskLevel,
      riskScore,
      status: status || 'Open',
      lossAmount: lossAmount ? Number(lossAmount) : 0,
      incidentDate: incidentDate || new Date(),
      assignedOfficer: req.user?._id,
      officerName: req.user?.name || 'Investigator',
      tags: tags || [],
      victimInfo: {
        name: victimName || 'Undisclosed',
        phone: victimPhone || 'N/A',
        email: victimEmail || 'N/A',
        address: victimAddress || 'N/A',
        bankName: victimBank || 'N/A',
      },
    });

    // Create audit log
    await AuditLog.create({
      action: 'CASE_CREATED',
      performedBy: req.user?._id,
      userName: req.user?.name || 'Investigator',
      caseId: newCase.caseId,
      ipAddress: req.ip || '127.0.0.1',
      details: `Created new investigation case: ${newCase.caseId} - "${newCase.title}"`,
    }).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'Investigation case created successfully.',
      data: newCase,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update case details
 * @route   PUT /api/cases/:id
 * @access  Private
 */
export const updateCase = async (req, res, next) => {
  try {
    const caseItem = await Case.findOne({
      $or: [{ caseId: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }],
    });

    if (!caseItem) {
      return res.status(404).json({
        success: false,
        message: 'Case not found.',
      });
    }

    const updated = await Case.findByIdAndUpdate(caseItem._id, req.body, {
      new: true,
      runValidators: true,
    });

    // Audit log
    await AuditLog.create({
      action: 'CASE_UPDATED',
      performedBy: req.user?._id,
      userName: req.user?.name || 'Investigator',
      caseId: caseItem.caseId,
      ipAddress: req.ip || '127.0.0.1',
      details: `Updated case details for: ${caseItem.caseId}`,
    }).catch(() => {});

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a case
 * @route   DELETE /api/cases/:id
 * @access  Private
 */
export const deleteCase = async (req, res, next) => {
  try {
    const caseItem = await Case.findOne({
      $or: [{ caseId: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }],
    });

    if (!caseItem) {
      return res.status(404).json({
        success: false,
        message: 'Case not found.',
      });
    }

    await Case.findByIdAndDelete(caseItem._id);
    await Evidence.deleteMany({ caseId: caseItem.caseId });

    // Audit log
    await AuditLog.create({
      action: 'CASE_DELETED',
      performedBy: req.user?._id,
      userName: req.user?.name || 'Investigator',
      caseId: caseItem.caseId,
      ipAddress: req.ip || '127.0.0.1',
      details: `Deleted case ${caseItem.caseId} and purged associated evidence records.`,
    }).catch(() => {});

    res.status(200).json({
      success: true,
      message: `Case ${caseItem.caseId} deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};
