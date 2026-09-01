import AuditLog from '../models/AuditLog.js';

/**
 * @desc    Get forensic audit logs for chain of custody verification
 * @route   GET /api/audit-logs
 * @access  Private (Admin / Lead Analyst)
 */
export const getAuditLogs = async (req, res, next) => {
  try {
    const { action, caseId, limit = 50 } = req.query;
    const query = {};

    if (action) query.action = action;
    if (caseId) query.caseId = caseId;

    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate('performedBy', 'name email role badgeNumber');

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};
