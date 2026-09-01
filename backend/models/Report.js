import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reportId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    caseId: {
      type: String,
      required: true,
      index: true,
    },
    caseTitle: {
      type: String,
      required: true,
    },
    reportType: {
      type: String,
      enum: [
        'Complete Case Report',
        'Preliminary Forensic Assessment',
        'Financial Fraud Statement',
        'Court Exhibit Summary',
        'Executive Intelligence Brief',
      ],
      default: 'Complete Case Report',
    },
    author: {
      type: String,
      default: 'Investigating Officer',
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['Draft', 'Generated', 'Verified', 'Submitted to Court'],
      default: 'Generated',
    },
    summary: {
      type: String,
      required: true,
    },
    findings: [
      {
        category: { type: String },
        detail: { type: String },
        severity: { type: String },
      },
    ],
    legalSections: [
      {
        statute: { type: String }, // e.g. "Information Technology Act, 2000"
        section: { type: String }, // e.g. "Section 66D (Cheating by personation using computer resource)"
        description: { type: String },
      },
    ],
    recommendedActions: [{ type: String }],
    courtSubmissionDetails: {
      judgeOrCourtName: { type: String, default: '' },
      policeStation: { type: String, default: '' },
      caseDiaryNumber: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('Report', reportSchema);
export default Report;
