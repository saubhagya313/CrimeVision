import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema(
  {
    caseId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a case title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a case description'],
    },
    caseType: {
      type: String,
      required: true,
      enum: [
        'UPI / Payment Fraud',
        'Phishing & Credential Theft',
        'Investment / Crypto Scam',
        'Job Offer Fraud',
        'Identity Theft & Impersonation',
        'Ransomware & Extortion',
        'SIM Swap Scam',
        'Other Cybercrime',
      ],
      default: 'UPI / Payment Fraud',
    },
    status: {
      type: String,
      enum: ['Submitted', 'Open', 'Under Investigation', 'Pending Review', 'Closed', 'Archived'],
      default: 'Submitted',
      index: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'High',
      index: true,
    },
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'High',
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 75,
    },
    incidentDate: {
      type: Date,
      default: Date.now,
    },
    lossAmount: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'INR (₹)',
    },
    victimInfo: {
      name: { type: String, default: 'Undisclosed' },
      phone: { type: String, default: 'N/A' },
      email: { type: String, default: 'N/A' },
      address: { type: String, default: 'N/A' },
      bankName: { type: String, default: 'N/A' },
    },
    suspectInfo: {
      name: { type: String, default: 'Unknown' },
      phoneNumbers: [{ type: String }],
      upiIds: [{ type: String }],
      bankAccounts: [{ type: String }],
      ipAddresses: [{ type: String }],
      urls: [{ type: String }],
      cryptoWallets: [{ type: String }],
    },
    assignedOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    officerName: {
      type: String,
      default: 'Unassigned',
    },
    evidenceCount: {
      type: Number,
      default: 0,
    },
    tags: [{ type: String }],
    firNumber: {
      type: String,
      default: '',
    },
    policeStation: {
      type: String,
      default: 'Cyber Police Station',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for evidence list populated from Evidence model
caseSchema.virtual('evidenceList', {
  ref: 'Evidence',
  localField: 'caseId',
  foreignField: 'caseId',
  justOne: false,
});

const Case = mongoose.model('Case', caseSchema);
export default Case;
