import TimelineEvent from '../models/TimelineEvent.js';
import AuditLog from '../models/AuditLog.js';

/**
 * @desc    Get chronological timeline events for a case
 * @route   GET /api/timeline/:caseId?
 * @access  Private
 */
export const getTimeline = async (req, res, next) => {
  try {
    const { caseId } = req.params;
    const { category } = req.query;
    const query = {};

    if (caseId) query.caseId = caseId;
    if (category && category !== 'All' && category !== 'All Events') {
      query.category = category;
    }

    const events = await TimelineEvent.find(query).sort({ timestamp: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a new timeline event
 * @route   POST /api/timeline
 * @access  Private
 */
export const addTimelineEvent = async (req, res, next) => {
  try {
    const { caseId, title, description, category, severity, timestamp, source, evidenceRef, confidenceScore } = req.body;

    if (!caseId || !title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Case ID, event title, and description are required.',
      });
    }

    const event = await TimelineEvent.create({
      caseId,
      title,
      description,
      category: category || 'Initial Contact',
      severity: severity || 'Medium',
      timestamp: timestamp || new Date(),
      source: source || 'Forensic Extraction',
      evidenceRef: evidenceRef || '',
      confidenceScore: confidenceScore || 85,
      recordedBy: req.user?._id,
    });

    // Audit log
    await AuditLog.create({
      action: 'TIMELINE_EVENT_ADDED',
      performedBy: req.user?._id,
      userName: req.user?.name || 'Investigator',
      caseId,
      ipAddress: req.ip || '127.0.0.1',
      details: `Added timeline event "${title}" for case ${caseId}`,
    }).catch(() => {});

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a timeline event
 * @route   DELETE /api/timeline/:id
 * @access  Private
 */
export const deleteTimelineEvent = async (req, res, next) => {
  try {
    const event = await TimelineEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Timeline event not found.',
      });
    }

    await TimelineEvent.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Timeline event removed.',
    });
  } catch (error) {
    next(error);
  }
};
