import mongoose from 'mongoose';

const evidenceSchema = new mongoose.Schema(
  {
    evidenceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    caseId: {
      type: String,
      required: [true, 'Please link this evidence to a case ID'],
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
    },
    fileType: {
      type: String,
      enum: ['Chat Log', 'Email', 'Screenshot', 'Bank Statement', 'SMS', 'Audio', 'Network Log', 'Document', 'Other'],
      default: 'Screenshot',
    },
    mimeType: {
      type: String,
      default: 'image/png',
    },
    fileSize: {
      type: String,
      default: '0 KB',
    },
    fileUrl: {
      type: String,
      default: '',
    },
    sha256Hash: {
      type: String,
      required: [true, 'Cryptographic hash required for legal chain of custody'],
      index: true,
    },
    processingStatus: {
      type: String,
      enum: ['Uploaded', 'Processing', 'Analyzed', 'Failed'],
      default: 'Uploaded',
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
    predictedThreat: {
      type: String,
      default: 'Pending Analysis',
    },
    ocrText: {
      type: String,
      default: '',
    },
    extractedEntities: [
      {
        type: {
          type: String,
          enum: ['Phone', 'UPI_ID', 'URL', 'Amount', 'Email', 'CryptoWallet', 'IP_Address', 'Account_Number'],
        },
        value: { type: String },
        label: { type: String },
        risk: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
      },
    ],
    fraudIndicators: [
      {
        name: { type: String },
        explanation: { type: String },
        confidence: { type: Number },
        weight: { type: Number },
        reference: { type: String },
      },
    ],
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    uploaderName: {
      type: String,
      default: 'Investigator',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Evidence = mongoose.model('Evidence', evidenceSchema);
export default Evidence;
