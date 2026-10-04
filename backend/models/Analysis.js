import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema(
  {
    analysisId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userName: {
      type: String,
      default: 'Citizen User',
    },
    sourceType: {
      type: String,
      enum: ['Screenshot / Image', 'PDF Document', 'Suspicious Text', 'Transaction Receipt', 'Other Evidence'],
      default: 'Suspicious Text',
    },
    fileName: {
      type: String,
      default: '',
    },
    fileUrl: {
      type: String,
      default: '',
    },
    fileHash: {
      type: String,
      default: '',
      index: true, // SHA-256 hash for duplicate evidence detection
    },
    imageQuality: {
      isBlurry: { type: Boolean, default: false },
      resolution: { type: String, default: '' },
      qualityWarning: { type: String, default: '' },
    },
    extractedText: {
      type: String,
      required: true,
    },
    predictedCategory: {
      type: String,
      required: true,
      default: 'Potential Cyber Fraud',
    },
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    confidence: {
      type: Number,
      default: 85,
    },
    entities: [
      {
        type: { type: String, required: true },
        value: { type: String, required: true },
        label: { type: String, default: '' },
        risk: { type: String, default: 'Medium' },
      },
    ],
    indicators: [
      {
        name: { type: String },
        explanation: { type: String },
        confidence: { type: Number },
        weight: { type: Number },
      },
    ],
    timeline: [
      {
        date: { type: String },
        time: { type: String },
        event: { type: String },
        source: { type: String, default: 'Extracted from Evidence' },
      },
    ],
    complaintDraftGenerated: {
      type: Boolean,
      default: false,
    },
    complaintDraftId: {
      type: String,
      default: '',
    },
    feedback: {
      isCorrect: { type: Boolean, default: null },
      userLabeledCategory: { type: String, default: '' },
      comment: { type: String, default: '' },
      submittedAt: { type: Date, default: null },
    },
    modelEngine: {
      type: String,
      default: 'CrimeVision ML Model',
    },
  },
  {
    timestamps: true,
  }
);

const Analysis = mongoose.model('Analysis', analysisSchema);
export default Analysis;
