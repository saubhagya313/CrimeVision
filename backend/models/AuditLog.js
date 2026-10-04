import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        'USER_LOGIN',
        'USER_REGISTER',
        'USER_ACTIVATED',
        'USER_DEACTIVATED',
        'USER_ROLE_UPDATED',
        'AI_ANALYSIS_EXECUTED',
        'ANALYSIS_DELETED',
        'FEEDBACK_SUBMITTED',
        'COMPLAINT_DRAFT_CREATED',
        'COMPLAINT_DRAFT_UPDATED',
        'COMPLAINT_DRAFT_EXPORTED',
        'COMPLAINT_DRAFT_DELETED',
        'CASE_CREATED',
        'CASE_UPDATED',
        'CASE_DELETED',
        'EVIDENCE_UPLOADED',
        'EVIDENCE_HASH_VERIFIED',
        'REPORT_GENERATED',
        'TIMELINE_EVENT_ADDED',
        'SYSTEM_CONFIG_CHANGED',
      ],
      index: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    userName: {
      type: String,
      default: 'System',
    },
    userRole: {
      type: String,
      default: 'User',
    },
    caseId: {
      type: String,
      default: null,
      index: true,
    },
    evidenceId: {
      type: String,
      default: null,
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
    details: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
