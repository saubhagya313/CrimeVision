import mongoose from 'mongoose';

const timelineEventSchema = new mongoose.Schema(
  {
    caseId: {
      type: String,
      required: [true, 'Case ID is required for a timeline event'],
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    category: {
      type: String,
      enum: [
        'Initial Contact',
        'Suspicious Link / Phishing',
        'Unauthorized Transaction',
        'Communication Cutoff',
        'Evidence Ingestion',
        'System Alert',
        'Suspect Traced',
        'Legal Notice Served',
      ],
      default: 'Initial Contact',
    },
    severity: {
      type: String,
      enum: ['Info', 'Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    source: {
      type: String,
      default: 'Manual Entry',
    },
    evidenceRef: {
      type: String,
      default: '',
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 85,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const TimelineEvent = mongoose.model('TimelineEvent', timelineEventSchema);
export default TimelineEvent;
