import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../models/User.js';
import Analysis from '../models/Analysis.js';
import ComplaintDraft from '../models/ComplaintDraft.js';
import Case from '../models/Case.js';
import Evidence from '../models/Evidence.js';
import AuditLog from '../models/AuditLog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const sampleUsers = [
  {
    name: 'Ajit Kumar Sethi (System Admin)',
    email: 'ajitkumarsethi34@gmail.com',
    password: 'password123',
    role: 'Admin',
    department: 'Platform Administration & Cyber Cell',
    organization: 'CrimeVision System Management',
    phone: '+91 98765 43210',
    address: 'Plot 42, Cyber Security Complex, Sector 62',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201301',
    isActive: true,
  },
  {
    name: 'CrimeVision System Admin',
    email: 'admin@crimevision.in',
    password: 'password123',
    role: 'Admin',
    department: 'Platform Administration',
    organization: 'CrimeVision System Management',
    phone: '+91 98111 22334',
    address: 'HQ Cyber Command, Institutional Area',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    isActive: true,
  },
  {
    name: 'Ajit Kumar',
    email: 'ajit@example.com',
    password: 'password123',
    role: 'User',
    department: 'General Public',
    organization: 'Citizen',
    phone: '+91 98765 43210',
    address: 'Flat 402, Sunshine Heights, Sector 62',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201301',
    isActive: true,
  },
  {
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    password: 'password123',
    role: 'User',
    department: 'General Public',
    organization: 'Citizen',
    phone: '+91 91234 56789',
    address: 'B-14, Mayur Vihar Phase 1',
    city: 'East Delhi',
    state: 'Delhi',
    pincode: '110091',
    isActive: true,
  },
  {
    name: 'Pooja Verma',
    email: 'pooja@example.com',
    password: 'password123',
    role: 'User',
    department: 'General Public',
    organization: 'Citizen',
    phone: '+91 99887 76655',
    address: 'House 88, Gomti Nagar Extension',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226010',
    isActive: true,
  },
  {
    name: 'Vikram Mehta',
    email: 'vikram@example.com',
    password: 'password123',
    role: 'User',
    department: 'General Public',
    organization: 'Citizen',
    phone: '+91 98220 11223',
    address: 'Flat 12B, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    isActive: false, // Inactive user for testing admin user management
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crimevision';
    console.log(`Connecting to MongoDB for seeding at: ${mongoUri.replace(/:([^:@]+)@/, ':****@')}`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing collections...');
    await User.deleteMany({});
    await Analysis.deleteMany({});
    await ComplaintDraft.deleteMany({});
    await Case.deleteMany({});
    await Evidence.deleteMany({});
    await AuditLog.deleteMany({});

    console.log('Seeding system users...');
    const createdUsers = await User.create(sampleUsers);
    const ajit = createdUsers.find((u) => u.email === 'ajit@example.com');
    const rahul = createdUsers.find((u) => u.email === 'rahul@example.com');
    const admin = createdUsers.find((u) => u.email === 'admin@crimevision.in');

    console.log('Seeding sample evidence analyses with CV-ANL format...');
    const sampleAnalyses = [
      {
        analysisId: 'CV-ANL-2026-0001',
        userId: ajit._id,
        userName: ajit.name,
        sourceType: 'Screenshot / Image',
        fileName: 'whatsapp_cashback_qr_chat.png',
        fileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        imageQuality: { isBlurry: false, resolution: '1080x1920', qualityWarning: '' },
        extractedText: `WhatsApp Chat with +91 99000 11223:
[10 Sep, 10:30 AM] +91 99000 11223: Congratulations! You won ₹25,000 Diwali cashback from GPay reward portal.
[10 Sep, 10:32 AM] +91 99000 11223: Scan this QR code and enter your UPI PIN to receive money directly into your SBI bank account.
[10 Sep, 10:35 AM] +91 99000 11223: Payment request sent to cyber-mule@okaxis.
[10 Sep, 10:36 AM] Bank Alert: Rs 25,000 debited from A/C XX4921 via UPI Ref UTR 429184719284.`,
        predictedCategory: 'UPI / Payment Fraud',
        riskLevel: 'Critical',
        riskScore: 92,
        confidence: 96,
        entities: [
          { type: 'Phone', value: '+91 99000 11223', label: 'Extracted Phone Number', risk: 'High' },
          { type: 'UPI_ID', value: 'cyber-mule@okaxis', label: 'Virtual Payment Address (UPI VPA)', risk: 'Critical' },
          { type: 'Amount', value: '₹25,000', label: 'Monetary Amount', risk: 'Medium' },
          { type: 'Transaction_ID', value: '429184719284', label: 'Transaction / UTR Reference ID', risk: 'High' },
          { type: 'Bank_Name', value: 'SBI', label: 'Identified Bank / Financial Entity', risk: 'Low' },
          { type: 'Date', value: '10 Sep', label: 'Extracted Date Timestamp', risk: 'Low' },
        ],
        indicators: [
          {
            name: 'Payment Request / PIN Trick Detected',
            explanation: 'Prompts victim to enter a UPI PIN or scan a QR code to "receive" funds, which in reality authorizes an immediate bank debit.',
            confidence: 96,
            weight: 45,
          },
          {
            name: 'UPI Payment Coordinate Detected',
            explanation: 'Detected combination of a Virtual Payment Address (UPI VPA) and specific monetary demand.',
            confidence: 90,
            weight: 30,
          },
        ],
        timeline: [
          { date: '10 Sep', time: '10:30 AM', event: 'Initial suspicious message offering fake cashback received', source: 'whatsapp_cashback_qr_chat.png' },
          { date: '10 Sep', time: '10:32 AM', event: 'Victim prompted to scan QR and enter UPI PIN to receive funds', source: 'whatsapp_cashback_qr_chat.png' },
          { date: '10 Sep', time: '10:36 AM', event: 'Unauthorized debit of ₹25,000 via UTR 429184719284', source: 'whatsapp_cashback_qr_chat.png' },
        ],
        complaintDraftGenerated: true,
        complaintDraftId: 'CV-CMP-2026-0001',
        feedback: {
          isCorrect: true,
          userLabeledCategory: 'UPI / Payment Fraud',
          comment: 'Identified the UPI VPA and fake PIN prompt accurately.',
          submittedAt: new Date('2026-09-10'),
        },
        modelEngine: 'CrimeVision ML Model (TF-IDF + Classifier)',
      },
      {
        analysisId: 'CV-ANL-2026-0002',
        userId: rahul._id,
        userName: rahul.name,
        sourceType: 'Suspicious Text',
        fileName: 'electricity_threat_sms.png',
        fileHash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
        imageQuality: { isBlurry: false, resolution: '720x1280', qualityWarning: '' },
        extractedText: `Dear Customer, Your BSES Electricity power supply will be disconnected tonight at 9:30 PM because previous month bill was not updated. Please immediately update and pay Rs 4,500 by calling our officer at +91 91238 47291 or visit http://bses-bill-quickpay.cc to avoid disconnect.`,
        predictedCategory: 'Phishing & Credential Theft',
        riskLevel: 'High',
        riskScore: 84,
        confidence: 91,
        entities: [
          { type: 'Phone', value: '+91 91238 47291', label: 'Extracted Phone Number', risk: 'High' },
          { type: 'URL', value: 'http://bses-bill-quickpay.cc', label: 'Suspicious / Phishing URL', risk: 'Critical' },
          { type: 'Amount', value: 'Rs 4,500', label: 'Monetary Amount', risk: 'Medium' },
        ],
        indicators: [
          {
            name: 'Credential Harvesting / Phishing URL',
            explanation: 'Contains suspicious domain or request to input credentials through an unverified external link.',
            confidence: 93,
            weight: 40,
          },
          {
            name: 'Urgency & Pressure Tactics Detected',
            explanation: 'High-pressure wording threatening immediate utility disconnection.',
            confidence: 88,
            weight: 25,
          },
        ],
        timeline: [
          { date: new Date().toLocaleDateString('en-GB'), time: 'Evening', event: 'Disconnection threat SMS received with phishing link', source: 'electricity_threat_sms.png' },
        ],
        complaintDraftGenerated: false,
        feedback: {
          isCorrect: true,
          userLabeledCategory: 'Phishing & Credential Theft',
          comment: 'Correctly detected the fake BSES domain.',
          submittedAt: new Date(),
        },
        modelEngine: 'CrimeVision Heuristic NLP Engine',
      },
      {
        analysisId: 'CV-ANL-2026-0003',
        userId: ajit._id,
        userName: ajit.name,
        sourceType: 'Suspicious Text',
        fileName: '',
        extractedText: `Dear SBI Customer, your account XX4921 has been credited with INR 5,000.00 on 04-Oct-2026 via NEFT from ABC Corp. Available balance is INR 42,500.00. For queries call 1800112211.`,
        predictedCategory: 'No Significant Suspicious Indicators Detected',
        riskLevel: 'Low',
        riskScore: 12,
        confidence: 95,
        entities: [
          { type: 'Amount', value: 'INR 5,000.00', label: 'Monetary Amount', risk: 'Medium' },
          { type: 'Bank_Name', value: 'SBI', label: 'Identified Bank / Financial Entity', risk: 'Low' },
          { type: 'Date', value: '04-Oct-2026', label: 'Extracted Date Timestamp', risk: 'Low' },
        ],
        indicators: [],
        timeline: [
          { date: '04-Oct-2026', time: 'Bank Notification', event: 'Routine NEFT credit message received', source: 'SMS Alert' },
        ],
        complaintDraftGenerated: false,
        feedback: {
          isCorrect: true,
          userLabeledCategory: 'Legitimate',
          comment: 'Correctly classified routine bank notification as low risk.',
          submittedAt: new Date(),
        },
        modelEngine: 'CrimeVision Heuristic NLP Engine',
      },
    ];

    await Analysis.create(sampleAnalyses);

    console.log('Seeding sample complaint draft with CV-CMP format...');
    const sampleDraft = {
      draftId: 'CV-CMP-2026-0001',
      userId: ajit._id,
      userName: ajit.name,
      analysisId: 'CV-ANL-2026-0001',
      complainantInfo: {
        name: 'Ajit Kumar',
        mobile: '+91 98765 43210',
        email: 'ajit@example.com',
        address: 'Flat 402, Sunshine Heights, Sector 62',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201301',
      },
      incidentInfo: {
        incidentDate: '2026-09-10',
        incidentTime: '10:35 AM',
        incidentType: 'UPI / Payment Fraud',
        description:
          'I received a WhatsApp message from +91 99000 11223 promising Diwali cashback from GPay. The fraudster sent a QR code and instructed me to enter my UPI PIN to claim ₹25,000. Immediately upon entering the PIN, an unauthorized debit of ₹25,000 occurred to cyber-mule@okaxis with UTR 429184719284.',
        financialLoss: 25000,
        currency: 'INR (₹)',
      },
      suspectInfo: {
        phoneNumbers: ['+91 99000 11223'],
        upiIds: ['cyber-mule@okaxis'],
        transactionIds: ['429184719284'],
        bankAccounts: [],
        emails: [],
        urls: [],
        names: ['Unknown WhatsApp Fraudster'],
        otherDetails: 'Claimed to represent GPay festive reward department.',
      },
      evidence: {
        files: [{ name: 'whatsapp_cashback_qr_chat.png', type: 'image/png', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' }],
        extractedTextSummary:
          'WhatsApp Chat: Promised ₹25,000 reward -> Sent QR -> Debited ₹25,000 to cyber-mule@okaxis via UTR 429184719284.',
      },
      aiAnalysis: {
        fraudCategory: 'UPI / Payment Fraud',
        riskLevel: 'Critical',
        confidence: 96,
        indicators: [
          {
            name: 'Payment Request / PIN Trick Detected',
            explanation: 'Prompts victim to enter UPI PIN to receive money, resulting in immediate unauthorized debit.',
          },
        ],
      },
      timeline: [
        { date: '10 Sep 2026', event: 'Received fraudulent cashback lure message on WhatsApp', source: 'whatsapp_cashback_qr_chat.png' },
        { date: '10 Sep 2026', event: 'Scanned QR code and entered UPI PIN as instructed', source: 'whatsapp_cashback_qr_chat.png' },
        { date: '10 Sep 2026', event: 'Unauthorized debit of ₹25,000 recorded under UTR 429184719284', source: 'whatsapp_cashback_qr_chat.png' },
      ],
      policeStation: {
        name: 'Cyber Crime Police Station, Sector 108',
        address: 'Police Commissionerate, Sector 108, Noida, Gautam Buddha Nagar',
        city: 'Noida',
        contact: '0120-2560003 / 1930',
        distance: '4.2 km',
      },
      declarationAccepted: true,
      status: 'Draft',
    };

    await ComplaintDraft.create(sampleDraft);

    console.log('Seeding system audit logs...');
    const sampleLogs = [
      {
        action: 'USER_REGISTER',
        performedBy: ajit._id,
        userName: ajit.name,
        userRole: 'User',
        ipAddress: '192.168.1.10',
        details: 'Citizen registered: Ajit Kumar (ajit@example.com)',
      },
      {
        action: 'AI_ANALYSIS_EXECUTED',
        performedBy: ajit._id,
        userName: ajit.name,
        userRole: 'User',
        ipAddress: '192.168.1.10',
        details: 'Executed digital evidence analysis [CV-ANL-2026-0001]. Risk: Critical (92%), Category: UPI / Payment Fraud',
      },
      {
        action: 'FEEDBACK_SUBMITTED',
        performedBy: ajit._id,
        userName: ajit.name,
        userRole: 'User',
        ipAddress: '192.168.1.10',
        details: 'User submitted feedback for [CV-ANL-2026-0001]: Accurate (Label: UPI / Payment Fraud)',
      },
      {
        action: 'COMPLAINT_DRAFT_CREATED',
        performedBy: ajit._id,
        userName: ajit.name,
        userRole: 'User',
        ipAddress: '192.168.1.10',
        details: 'Generated citizen complaint draft [CV-CMP-2026-0001] for UPI / Payment Fraud',
      },
      {
        action: 'USER_LOGIN',
        performedBy: admin._id,
        userName: admin.name,
        userRole: 'Admin',
        ipAddress: '127.0.0.1',
        details: 'System Administrator logged in to CrimeVision management console',
      },
    ];

    await AuditLog.create(sampleLogs);

    console.log('\n\x1b[32m✔ SUCCESS: Database seeded with standard CV-ANL and CV-CMP Reference IDs!\x1b[0m');
    console.log('================================================================');
    console.log('🛠️  ADMIN (APPLICATION MANAGEMENT) CREDENTIALS:');
    console.log('   1) Email: ajitkumarsethi34@gmail.com | Password: password123');
    console.log('   2) Email: admin@crimevision.in        | Password: password123');
    console.log('----------------------------------------------------------------');
    console.log('👤 CITIZEN / USER CREDENTIALS:');
    console.log('   1) Email: ajit@example.com   | Password: password123');
    console.log('   2) Email: rahul@example.com  | Password: password123');
    console.log('   3) Email: pooja@example.com  | Password: password123');
    console.log('================================================================\n');

    process.exit(0);
  } catch (error) {
    console.error(`\x1b[31m✖ Seeder Error: ${error.message}\x1b[0m`);
    process.exit(1);
  }
};

seedDatabase();
