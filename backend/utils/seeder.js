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

// Sample Citizens / Users who submit complaints
const sampleUsers = [
  {
    name: 'Ajit Kumar',
    email: 'ajit@example.com',
    password: 'password123',
    role: 'User',
    department: 'General Public',
    organization: 'Citizen',
    phone: '+91 98765 43210',
  },
  {
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    password: 'password123',
    role: 'User',
    department: 'General Public',
    organization: 'Citizen',
    phone: '+91 91234 56789',
  },
  {
    name: 'Pooja Verma',
    email: 'pooja@example.com',
    password: 'password123',
    role: 'User',
    department: 'General Public',
    organization: 'Citizen',
    phone: '+91 99887 76655',
  },
];

// Sample Problems / Cyber Complaints submitted by users
const sampleCases = [
  {
    caseId: 'CV-2026-001',
    title: 'UPI Cashback QR Scam - ₹25,000 Deducted',
    description: 'Received a WhatsApp message promising festive cashback. When I scanned the QR code and entered my PIN, ₹25,000 was debited from my bank account.',
    caseType: 'UPI / Payment Fraud',
    priority: 'High',
    riskLevel: 'High',
    riskScore: 88,
    status: 'Submitted',
    lossAmount: 25000,
    incidentDate: new Date('2026-02-18'),
    victimInfo: {
      name: 'Ajit Kumar',
      phone: '+91 98765 43210',
      email: 'ajit@example.com',
      address: 'Sector 62, Noida, UP',
      bankName: 'State Bank of India',
    },
    suspectInfo: {
      phoneNumbers: ['+91 99000 11223'],
      upiIds: ['cyber-mule@okaxis'],
    },
    tags: ['UPI PIN Scam', 'WhatsApp Fraud'],
  },
  {
    caseId: 'CV-2026-002',
    title: 'Electricity Bill Disconnection Threat Message',
    description: 'Got an SMS stating electricity will be disconnected tonight. A link was provided to pay an overdue amount of ₹4,500.',
    caseType: 'Phishing & Credential Theft',
    priority: 'Medium',
    riskLevel: 'Medium',
    riskScore: 72,
    status: 'Submitted',
    lossAmount: 4500,
    incidentDate: new Date('2026-02-22'),
    victimInfo: {
      name: 'Rahul Sharma',
      phone: '+91 91234 56789',
      email: 'rahul@example.com',
      address: 'Indiranagar, Bengaluru, Karnataka',
      bankName: 'HDFC Bank',
    },
    suspectInfo: {
      phoneNumbers: ['+91 91238 47291'],
      urls: ['http://bses-bill-quickpay.cc'],
    },
    tags: ['Electricity Threat', 'Smishing'],
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

    console.log('Seeding sample users...');
    const createdUsers = await User.create(sampleUsers);

    console.log('Seeding sample complaints submitted by users...');
    const casesWithUser = sampleCases.map((c, index) => ({
      ...c,
      submittedBy: createdUsers[index % createdUsers.length]._id,
      userName: createdUsers[index % createdUsers.length].name,
    }));
    await Case.create(casesWithUser);

    console.log('\n\x1b[32m✔ SUCCESS: Database seeded with User & Complaint data!\x1b[0m');
    console.log('Sample User Credentials:');
    console.log('  1) Email: ajit@example.com   | Password: password123');
    console.log('  2) Email: rahul@example.com  | Password: password123');
    console.log('  3) Email: pooja@example.com  | Password: password123\n');

    process.exit(0);
  } catch (error) {
    console.error(`\x1b[31m✖ Seeder Error: ${error.message}\x1b[0m`);
    process.exit(1);
  }
};

seedDatabase();
