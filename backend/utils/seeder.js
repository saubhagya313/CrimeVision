import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../models/User.js';
import Case from '../models/Case.js';
import Evidence from '../models/Evidence.js';
import TimelineEvent from '../models/TimelineEvent.js';
import Report from '../models/Report.js';
import AuditLog from '../models/AuditLog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const sampleUsers = [
  {
    name: 'Inspector Rajesh Varma',
    email: 'officer@cybercrime.gov.in',
    password: 'Password@123',
    role: 'Forensic Lead',
    badgeNumber: 'CYB-4091',
    department: 'Cyber Forensics Unit',
    organization: 'State Cyber Crime Cell',
  },
  {
    name: 'Analyst Priya Sharma',
    email: 'priya.analyst@cybercrime.gov.in',
    password: 'Password@123',
    role: 'Investigator',
    badgeNumber: 'CYB-8812',
    department: 'Digital Intelligence Division',
    organization: 'State Cyber Crime Cell',
  },
];

const sampleCases = [
  {
    caseId: 'CV-2026-001',
    title: 'High-Value UPI Cashback QR Scam - ₹2.4 Lakhs Loss',
    description: 'Victim lured into scanning a fake cashback reward QR code on WhatsApp, which initiated unauthorized debits via forged VPA merchant endpoints.',
    caseType: 'UPI / Payment Fraud',
    priority: 'Critical',
    riskLevel: 'Critical',
    riskScore: 94,
    status: 'Under Investigation',
    lossAmount: 240000,
    incidentDate: new Date('2026-02-18'),
    victimInfo: {
      name: 'Aditya Kumar Saxena',
      phone: '+91 98112 34567',
      email: 'aditya.saxena@example.com',
      address: 'Indiranagar, Bengaluru, Karnataka',
      bankName: 'HDFC Bank Ltd.',
    },
    suspectInfo: {
      phoneNumbers: ['+91 99000 11223', '+91 88776 54321'],
      upiIds: ['cyber-mule@okaxis', 'quick-refunds@ybl'],
      bankAccounts: ['HDFC-991823004112'],
      ipAddresses: ['103.212.44.18'],
    },
    tags: ['UPI PIN Scam', 'WhatsApp Fraud', 'Jamtara Link'],
  },
  {
    caseId: 'CV-2026-002',
    title: 'Electricity Disconnection Threat & KYC Impersonation',
    description: 'Impersonation of State Electricity Board officer claiming immediate power cutoff unless bill cleared via suspicious APK installer link.',
    caseType: 'Identity Theft & Impersonation',
    priority: 'High',
    riskLevel: 'High',
    riskScore: 82,
    status: 'Open',
    lossAmount: 45000,
    incidentDate: new Date('2026-02-22'),
    victimInfo: {
      name: 'Sunita Mehra',
      phone: '+91 98450 11928',
      email: 'sunita.m@example.com',
      address: 'South Extension, New Delhi',
      bankName: 'State Bank of India',
    },
    suspectInfo: {
      phoneNumbers: ['+91 91238 47291'],
      urls: ['http://uidai-aadhaar-portal-verify.in', 'http://bses-bill-quickpay.cc'],
    },
    tags: ['KYC Scam', 'Electricity Threat', 'Smishing'],
  },
  {
    caseId: 'CV-2026-003',
    title: 'Telegram Crypto Arbitrage & High-Yield Ponzi Fraud',
    description: 'Victim promised 300% weekly returns via fake AI automated crypto trading bot on Telegram, culminating in account freeze and extortion.',
    caseType: 'Investment / Crypto Scam',
    priority: 'High',
    riskLevel: 'High',
    riskScore: 89,
    status: 'Under Investigation',
    lossAmount: 580000,
    incidentDate: new Date('2026-02-14'),
    victimInfo: {
      name: 'Rohan Deshmukh',
      phone: '+91 99201 88472',
      email: 'rohan.desh@example.com',
      address: 'Kothrud, Pune, Maharashtra',
      bankName: 'ICICI Bank',
    },
    suspectInfo: {
      cryptoWallets: ['0x8492019482910fedcba9876543210abcdef12345', 'TRC20-TYuK8291823901849102'],
      urls: ['http://solar-green-token.biz'],
    },
    tags: ['Crypto Scam', 'Telegram Bot', 'USDT Extortion'],
  },
];

const sampleEvidence = [
  {
    evidenceId: 'EVD-0001',
    caseId: 'CV-2026-001',
    fileName: 'whatsapp_qr_chat_evidence.png',
    originalName: 'whatsapp_qr_chat_evidence.png',
    fileType: 'Chat Log',
    mimeType: 'image/png',
    fileSize: '1.4 MB',
    sha256Hash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    processingStatus: 'Analyzed',
    riskLevel: 'Critical',
    riskScore: 96,
    predictedThreat: 'UPI_Fraud',
    ocrText: 'Scan this QR code in Google Pay and enter your 6 digit UPI PIN to receive ₹25,000 festive refund directly to account.',
    extractedEntities: [
      { type: 'Phone', value: '+91 99000 11223', label: 'Suspect Caller', risk: 'High' },
      { type: 'UPI_ID', value: 'cyber-mule@okaxis', label: 'Destination VPA', risk: 'Critical' },
      { type: 'Amount', value: '₹25,000', label: 'Claimed Cashback', risk: 'Medium' },
    ],
  },
  {
    evidenceId: 'EVD-0002',
    caseId: 'CV-2026-001',
    fileName: 'bank_debit_sms_statement.txt',
    originalName: 'bank_debit_sms_statement.txt',
    fileType: 'SMS',
    mimeType: 'text/plain',
    fileSize: '12 KB',
    sha256Hash: 'sha256:ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    processingStatus: 'Analyzed',
    riskLevel: 'High',
    riskScore: 88,
    predictedThreat: 'UPI_Fraud',
    ocrText: 'Dear Customer, your A/c has been debited by Rs 1,00,000 to VPA quick-refunds@ybl. Ref: UPI/602910482910.',
    extractedEntities: [
      { type: 'UPI_ID', value: 'quick-refunds@ybl', label: 'Flagged Mule VPA', risk: 'Critical' },
      { type: 'Amount', value: 'Rs 1,00,000', label: 'Debit Sum', risk: 'High' },
    ],
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crimevision';
    console.log(`Connecting to MongoDB for seeding at: ${mongoUri.replace(/:([^:@]+)@/, ':****@')}`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing data collections...');
    await User.deleteMany({});
    await Case.deleteMany({});
    await Evidence.deleteMany({});
    await TimelineEvent.deleteMany({});
    await Report.deleteMany({});
    await AuditLog.deleteMany({});

    console.log('Seeding demo investigators...');
    const createdUsers = await User.create(sampleUsers);

    console.log('Seeding cybercrime cases...');
    const casesWithOfficer = sampleCases.map((c) => ({
      ...c,
      assignedOfficer: createdUsers[0]._id,
      officerName: createdUsers[0].name,
    }));
    await Case.create(casesWithOfficer);

    console.log('Seeding digital forensic evidence...');
    await Evidence.create(sampleEvidence);

    console.log('Seeding audit logs...');
    await AuditLog.create({
      action: 'SYSTEM_CONFIG_CHANGED',
      performedBy: createdUsers[0]._id,
      userName: createdUsers[0].name,
      details: 'Database seeded with default forensic intelligence data.',
    });

    console.log('\n\x1b[32m✔ SUCCESS: Database seeded with initial CrimeVision data!\x1b[0m');
    console.log('Demo Credentials:');
    console.log('  Email:    officer@cybercrime.gov.in');
    console.log('  Password: Password@123\n');

    process.exit(0);
  } catch (error) {
    console.error(`\x1b[31m✖ Seeder Error: ${error.message}\x1b[0m`);
    process.exit(1);
  }
};

seedDatabase();
