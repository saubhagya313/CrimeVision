import mongoose from 'mongoose';

const complaintDraftSchema = new mongoose.Schema(
  {
    draftId: {
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
      default: 'Citizen',
    },
    analysisId: {
      type: String,
      default: '',
    },
    complainantInfo: {
      name: { type: String, required: true },
      mobile: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
    incidentInfo: {
      incidentDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
      incidentTime: { type: String, default: '' },
      incidentType: { type: String, required: true, default: 'UPI / Payment Fraud' },
      description: { type: String, required: true },
      financialLoss: { type: Number, default: 0 },
      currency: { type: String, default: 'INR (₹)' },
    },
    suspectInfo: {
      phoneNumbers: [{ type: String }],
      upiIds: [{ type: String }],
      emails: [{ type: String }],
      urls: [{ type: String }],
      transactionIds: [{ type: String }],
      bankAccounts: [{ type: String }],
      names: [{ type: String }],
      otherDetails: { type: String, default: '' },
    },
    evidence: {
      files: [
        {
          name: { type: String },
          type: { type: String },
          url: { type: String },
          hash: { type: String },
        },
      ],
      extractedTextSummary: { type: String, default: '' },
    },
    aiAnalysis: {
      fraudCategory: { type: String, default: 'UPI / Payment Fraud' },
      riskLevel: { type: String, default: 'High' },
      confidence: { type: Number, default: 90 },
      indicators: [
        {
          name: { type: String },
          explanation: { type: String },
        },
      ],
    },
    timeline: [
      {
        date: { type: String },
        event: { type: String },
        source: { type: String, default: 'Evidence Artifact' },
      },
    ],
    policeStation: {
      name: { type: String, default: 'Nearest Cyber Police Station' },
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      contact: { type: String, default: '1930 / Local Police' },
      distance: { type: String, default: '' },
    },
    legalSections: [
      {
        statute: { type: String },
        section: { type: String },
        description: { type: String },
      },
    ],
    declarationAccepted: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['Draft', 'Downloaded', 'Printed'],
      default: 'Draft',
    },
  },
  {
    timestamps: true,
  }
);

const ComplaintDraft = mongoose.model('ComplaintDraft', complaintDraftSchema);
export default ComplaintDraft;
