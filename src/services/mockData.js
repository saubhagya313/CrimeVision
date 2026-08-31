// Mock Data for CrimeVision Cyber Forensics Platform

export const MOCK_USER = {
  id: 'usr_inv_007',
  name: 'Inspector Vikram Singh',
  email: 'v.singh@cybercrime.gov.in',
  role: 'Senior Cyber Crime Investigator',
  organization: 'State Cyber Crime Directorate',
  department: 'Financial Fraud & Digital Forensics Unit',
  badgeNumber: 'IND-CCU-9842',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  permissions: ['case_create', 'evidence_upload', 'ai_analysis', 'report_generate', 'admin_access']
};

export const MOCK_STATS = {
  totalCases: 24,
  activeInvestigations: 8,
  evidenceFiles: 156,
  suspiciousEvidence: 37,
  highRiskCases: 6,
  trends: {
    totalCases: '+12.5%',
    activeInvestigations: '+4.2%',
    evidenceFiles: '+18.7%',
    suspiciousEvidence: '+9.1%',
    highRiskCases: '+2.0%'
  }
};

export const MOCK_CASES = [
  {
    id: 'CV-2026-001',
    title: 'UPI Payment Fraud Investigation',
    description: 'Victim was lured into scanning a fraudulent UPI QR code promising cashback of ₹18,500. Money was transferred to an unverified merchant VPA paytmqr-fastpay@paytm.',
    caseType: 'Online Payment Fraud',
    riskLevel: 'High',
    riskScore: 87,
    status: 'Active',
    priority: 'High',
    createdDate: '2026-08-14',
    lastUpdated: '2026-08-28 14:32',
    evidenceCount: 12,
    victimInfo: {
      name: 'Rajesh Sharma',
      phone: '+91 98765 43210',
      email: 'r.sharma@example.com',
      address: 'Sector 62, Noida, Uttar Pradesh'
    },
    incidentDate: '2026-08-14 11:20 AM'
  },
  {
    id: 'CV-2026-002',
    title: 'WhatsApp Investment Scam',
    description: 'High-yield crypto trading scam operating on WhatsApp group "Global Wealth VIP 8". Fraudsters extracted ₹4,50,000 across multiple UPI transactions.',
    caseType: 'Investment Scam',
    riskLevel: 'Critical',
    riskScore: 94,
    status: 'Under Review',
    priority: 'Critical',
    createdDate: '2026-08-10',
    lastUpdated: '2026-08-29 09:15',
    evidenceCount: 18,
    victimInfo: {
      name: 'Anita Roy',
      phone: '+91 91234 56789',
      email: 'anita.r@domain.com',
      address: 'Koramangala, Bengaluru, Karnataka'
    },
    incidentDate: '2026-08-08 04:45 PM'
  },
  {
    id: 'CV-2026-003',
    title: 'Phishing Email & Impersonation',
    description: 'Spear-phishing email targeting corporate executive containing spoofed domain and fake credentials portal http://secure-verify-auth-portal.com.',
    caseType: 'Phishing',
    riskLevel: 'Medium',
    riskScore: 62,
    status: 'Active',
    priority: 'Medium',
    createdDate: '2026-08-20',
    lastUpdated: '2026-08-27 18:04',
    evidenceCount: 6,
    victimInfo: {
      name: 'Vikramaditya Verma',
      phone: '+91 99887 76655',
      email: 'v.verma@corp-mail.org',
      address: 'Bandra West, Mumbai, Maharashtra'
    },
    incidentDate: '2026-08-19 09:10 AM'
  },
  {
    id: 'CV-2026-004',
    title: 'Identity Theft & Micro-Loan Fraud',
    description: 'Fraudulent loan apps created unauthorized micro-loans using forged Aadhaar & PAN details extracted from compromised cloud storage.',
    caseType: 'Identity Theft',
    riskLevel: 'High',
    riskScore: 81,
    status: 'Active',
    priority: 'High',
    createdDate: '2026-08-02',
    lastUpdated: '2026-08-25 11:40',
    evidenceCount: 15,
    victimInfo: {
      name: 'Siddharth Patel',
      phone: '+91 94567 12345',
      email: 'siddharth.p@gmail.com',
      address: 'Navrangpura, Ahmedabad, Gujarat'
    },
    incidentDate: '2026-07-28 02:15 PM'
  },
  {
    id: 'CV-2026-005',
    title: 'Social Media Account Takeover',
    description: 'Instagram verification badge phishing scam resulting in unauthorized access to high-follower creator account and blackmail attempt.',
    caseType: 'Social Media Fraud',
    riskLevel: 'Low',
    riskScore: 35,
    status: 'Completed',
    priority: 'Low',
    createdDate: '2026-07-15',
    lastUpdated: '2026-08-12 16:50',
    evidenceCount: 8,
    victimInfo: {
      name: 'Meera Kapoor',
      phone: '+91 98111 22334',
      email: 'meera.k@creative-studio.io',
      address: 'Connaught Place, New Delhi'
    },
    incidentDate: '2026-07-14 08:30 PM'
  }
];

export const MOCK_EVIDENCE = [
  {
    id: 'EVD-001',
    caseId: 'CV-2026-001',
    fileName: 'whatsapp_chat_01.png',
    fileType: 'Chats',
    mimeType: 'image/png',
    fileSize: '2.4 MB',
    uploadDate: '2026-08-14 14:10',
    processingStatus: 'Analyzed',
    riskLevel: 'High',
    riskScore: 87,
    hash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    thumbnail: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&q=80&w=600',
    ocrText: `[14/08/26, 11:15:22 AM] Suspect (+91 98123 45678): Hello sir, I am calling from Paytm Care. You have won ₹18,500 cashback reward points.
[14/08/26, 11:16:05 AM] Victim (Rajesh): Is this genuine? How do I collect it?
[14/08/26, 11:17:10 AM] Suspect: Yes sir, scan this QR code immediately. Enter your UPI PIN to approve the credit to your HDFC Bank account.
[14/08/26, 11:18:44 AM] Suspect: Link: http://paytm-claim-cashback-instant.net/verify
[14/08/26, 11:20:01 AM] System: Payment of ₹18,500 debited from HDFC A/C xx4921 to VPA paytmqr-fastpay@paytm (Txn ID: 423891004921).
[14/08/26, 11:21:15 AM] Victim: Money was debited instead of credited! Please refund!
[14/08/26, 11:22:00 AM] Suspect: [Block/No Answer]`,
    extractedEntities: [
      { type: 'Phone', value: '+91 98123 45678', label: 'Suspect Mobile', risk: 'High' },
      { type: 'Phone', value: '+91 98765 43210', label: 'Victim Mobile', risk: 'Low' },
      { type: 'UPI_ID', value: 'paytmqr-fastpay@paytm', label: 'Fraudulent VPA', risk: 'Critical' },
      { type: 'URL', value: 'http://paytm-claim-cashback-instant.net/verify', label: 'Phishing Domain', risk: 'Critical' },
      { type: 'Transaction_ID', value: '423891004921', label: 'UPI Ref ID', risk: 'High' },
      { type: 'Amount', value: '₹18,500', label: 'Debited Sum', risk: 'Medium' },
      { type: 'Bank', value: 'HDFC Bank (A/C xx4921)', label: 'Target Account', risk: 'Low' }
    ],
    fraudIndicators: [
      {
        name: 'Urgency & High Pressure Language',
        explanation: 'Prompting immediate action ("immediately", "won reward") to bypass fraud verification.',
        confidence: 94,
        weight: 25,
        reference: 'Line 3: "scan this QR code immediately"'
      },
      {
        name: 'PIN Prompt Misdirection',
        explanation: 'Instructing victim to enter UPI PIN for receiving funds (UPI PIN is ONLY for debiting).',
        confidence: 98,
        weight: 28,
        reference: 'Line 3: "Enter your UPI PIN to approve the credit"'
      },
      {
        name: 'Suspicious Non-Official Domain',
        explanation: 'Domain registered outside official brand namespace (paytm-claim-cashback-instant.net).',
        confidence: 91,
        weight: 20,
        reference: 'Line 4: http://paytm-claim-cashback-instant.net'
      },
      {
        name: 'Impersonation of Payment Brand',
        explanation: 'Claiming to represent Paytm Care while operating from unverified private line.',
        confidence: 89,
        weight: 14,
        reference: 'Line 1: "calling from Paytm Care"'
      }
    ]
  },
  {
    id: 'EVD-002',
    caseId: 'CV-2026-001',
    fileName: 'upi_receipt_statement.pdf',
    fileType: 'Transactions',
    mimeType: 'application/pdf',
    fileSize: '1.1 MB',
    uploadDate: '2026-08-14 14:45',
    processingStatus: 'Analyzed',
    riskLevel: 'High',
    riskScore: 84,
    hash: 'sha256:8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
    ocrText: `HDFC BANK OFFICIAL STATEMENT - TRANSACTION ADVICE
Txn Date: 14-AUG-2026 11:20:01 IST
UPI Ref No: 423891004921
Remitter Name: RAJESH SHARMA
Remitter A/C: XXXXXXXX4921
Beneficiary VPA: paytmqr-fastpay@paytm
Beneficiary Name: FASTPAY GLOBAL ENTERPRISES
Amount: INR 18,500.00
Status: SUCCESSFUL
IP Address: 49.37.192.104 (Location: Jamtara, Jharkhand)`,
    extractedEntities: [
      { type: 'Transaction_ID', value: '423891004921', label: 'NPCI RRN', risk: 'High' },
      { type: 'UPI_ID', value: 'paytmqr-fastpay@paytm', label: 'Beneficiary VPA', risk: 'Critical' },
      { type: 'Name', value: 'FASTPAY GLOBAL ENTERPRISES', label: 'Mule Entity', risk: 'High' },
      { type: 'IP_Address', value: '49.37.192.104', label: 'Origin IP', risk: 'High' },
      { type: 'Location', value: 'Jamtara, Jharkhand', label: 'Geo Location', risk: 'High' }
    ],
    fraudIndicators: [
      {
        name: 'High Risk Geo-Fencing Match',
        explanation: 'Originating IP geolocation resolves to known high-risk cyber fraud cluster (Jamtara).',
        confidence: 96,
        weight: 35,
        reference: 'IP 49.37.192.104 (Jamtara, Jharkhand)'
      },
      {
        name: 'Shell Merchant Gateway VPA',
        explanation: 'Beneficiary registered under automated merchant aggregator without KYC physical audit.',
        confidence: 88,
        weight: 25,
        reference: 'VPA paytmqr-fastpay@paytm'
      }
    ]
  },
  {
    id: 'EVD-003',
    caseId: 'CV-2026-002',
    fileName: 'investment_group_screenshot.jpg',
    fileType: 'Images',
    mimeType: 'image/jpeg',
    fileSize: '3.8 MB',
    uploadDate: '2026-08-11 09:30',
    processingStatus: 'Analyzed',
    riskLevel: 'Critical',
    riskScore: 94,
    hash: 'sha256:7c9e7c160a72b473d319eac6b3f7f8e81561081d6836171542f5bf8026d36d41',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=600',
    ocrText: `GLOBAL WEALTH VIP 8 (WhatsApp Group - 412 members)
Admin +44 7911 123456 (Prof. Alexander Vance): Today's signal guaranteed 350% return in 4 hours on BTC/USDT synthetic contract!
Member +91 97111 88990: I just withdrew ₹85,000 profit! Thank you team!
Admin +44 7911 123456: Deposit minimum ₹50,000 to portal http://apex-wealth-trade.org/vip-deposit
Account Manager (+91 98333 77711): Send payment to ICICI A/C 990401504992 (IFSC: ICIC0009904, Name: APEX GLOBAL ASSET MGMT).`,
    extractedEntities: [
      { type: 'Phone', value: '+44 7911 123456', label: 'Overseas Admin', risk: 'Critical' },
      { type: 'Phone', value: '+91 98333 77711', label: 'Account Manager', risk: 'High' },
      { type: 'URL', value: 'http://apex-wealth-trade.org/vip-deposit', label: 'Fraudulent Platform', risk: 'Critical' },
      { type: 'Bank_Account', value: '990401504992 (ICICI)', label: 'Mule Account', risk: 'Critical' },
      { type: 'IFSC', value: 'ICIC0009904', label: 'Branch Code', risk: 'Medium' }
    ],
    fraudIndicators: [
      {
        name: 'Guaranteed Unrealistic Return Signal',
        explanation: 'Promising 350% return in 4 hours violates financial regulations and indicates Ponzi design.',
        confidence: 99,
        weight: 30,
        reference: 'Line 2: "guaranteed 350% return"'
      },
      {
        name: 'Shill Accounts & Fake Proof Screenshots',
        explanation: 'Group members broadcasting fabricated withdrawal proofs to induce FOMO.',
        confidence: 92,
        weight: 22,
        reference: 'Line 3: "I just withdrew ₹85,000 profit!"'
      },
      {
        name: 'Virtual Overseas Admin Line',
        explanation: 'Admin using UK VoIP number (+44) operating unregulated Indian banking accounts.',
        confidence: 95,
        weight: 24,
        reference: 'Admin +44 7911 123456'
      }
    ]
  },
  {
    id: 'EVD-004',
    caseId: 'CV-2026-003',
    fileName: 'phishing_mail_body.eml',
    fileType: 'Emails',
    mimeType: 'message/rfc822',
    fileSize: '512 KB',
    uploadDate: '2026-08-20 10:15',
    processingStatus: 'Analyzed',
    riskLevel: 'Medium',
    riskScore: 62,
    hash: 'sha256:3a6f1d2e8b9a4c5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9',
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600',
    ocrText: `From: "Corporate IT Support" <admin-portal-verify@corp-update-sys.net>
To: v.verma@corp-mail.org
Subject: URGENT: Mandatory Password Re-Authentication Required
Date: Wed, 19 Aug 2026 09:10:02 +0530

Dear Employee,
Your corporate single sign-on password will expire in 2 hours due to security maintenance.
Please verify your credentials at http://secure-verify-auth-portal.com immediately to maintain inbox access.

Failure to verify will lock your corporate workstation.

Regards,
IT Helpdesk`,
    extractedEntities: [
      { type: 'Email', value: 'admin-portal-verify@corp-update-sys.net', label: 'Spoofed Sender', risk: 'High' },
      { type: 'Email', value: 'v.verma@corp-mail.org', label: 'Target Employee', risk: 'Low' },
      { type: 'URL', value: 'http://secure-verify-auth-portal.com', label: 'Credential Harvester', risk: 'Critical' }
    ],
    fraudIndicators: [
      {
        name: 'Domain Typosquatting / Lookalike Domain',
        explanation: 'Sender domain corp-update-sys.net differs from legitimate corporate domain corp-mail.org.',
        confidence: 95,
        weight: 30,
        reference: 'admin-portal-verify@corp-update-sys.net'
      },
      {
        name: 'Account Suspension Threat',
        explanation: 'Coercive messaging threatening workstation lock within 2 hours.',
        confidence: 86,
        weight: 20,
        reference: 'Failure to verify will lock your workstation'
      }
    ]
  }
];

export const MOCK_TIMELINE = [
  {
    id: 'TL-101',
    caseId: 'CV-2026-001',
    date: '2026-08-14',
    time: '11:15:22',
    title: 'Initial WhatsApp Contact Established',
    description: 'Suspect (+91 98123 45678) initiated contact claiming to represent Paytm Care customer reward division.',
    category: 'Messages',
    sourceEvidence: 'whatsapp_chat_01.png',
    evidenceId: 'EVD-001',
    entity: '+91 98123 45678',
    amount: null,
    risk: 'Medium'
  },
  {
    id: 'TL-102',
    caseId: 'CV-2026-001',
    date: '2026-08-14',
    time: '11:18:44',
    title: 'Phishing URL Delivered',
    description: 'Suspect sent malicous link http://paytm-claim-cashback-instant.net/verify and instructed victim to scan embedded QR.',
    category: 'Emails',
    sourceEvidence: 'whatsapp_chat_01.png',
    evidenceId: 'EVD-001',
    entity: 'http://paytm-claim-cashback-instant.net',
    amount: null,
    risk: 'High'
  },
  {
    id: 'TL-103',
    caseId: 'CV-2026-001',
    date: '2026-08-14',
    time: '11:20:01',
    title: 'Unauthorized UPI Debit Transaction',
    description: 'Amount ₹18,500 debited from victim HDFC account xx4921 to VPA paytmqr-fastpay@paytm (NPCI Ref: 423891004921).',
    category: 'Transactions',
    sourceEvidence: 'upi_receipt_statement.pdf',
    evidenceId: 'EVD-002',
    entity: 'paytmqr-fastpay@paytm',
    amount: '₹18,500',
    risk: 'Critical'
  },
  {
    id: 'TL-104',
    caseId: 'CV-2026-001',
    date: '2026-08-14',
    time: '11:22:00',
    title: 'Communication Severed / Block',
    description: 'Suspect stopped answering victim calls and deleted WhatsApp avatar after money debit was reported.',
    category: 'Calls',
    sourceEvidence: 'whatsapp_chat_01.png',
    evidenceId: 'EVD-001',
    entity: '+91 98123 45678',
    amount: null,
    risk: 'High'
  },
  {
    id: 'TL-105',
    caseId: 'CV-2026-001',
    date: '2026-08-14',
    time: '14:10:00',
    title: 'Cyber Crime Portal Complaint Lodged',
    description: 'Victim submitted official report with screenshots and bank transaction advice to State Cyber Directorate.',
    category: 'Important Events',
    sourceEvidence: 'upi_receipt_statement.pdf',
    evidenceId: 'EVD-002',
    entity: 'Rajesh Sharma',
    amount: null,
    risk: 'Low'
  }
];

export const MOCK_REPORTS = [
  {
    id: 'REP-2026-089',
    caseId: 'CV-2026-001',
    caseTitle: 'UPI Payment Fraud Investigation',
    reportType: 'Complete Case Report',
    createdDate: '2026-08-28 16:45',
    status: 'Generated',
    author: 'Inspector Vikram Singh',
    downloadUrl: '#',
    summary: 'Comprehensive cyber-forensics report establishing fraudulent misdirection, VPA identity resolution, and Jamtara IP correlation.'
  },
  {
    id: 'REP-2026-074',
    caseId: 'CV-2026-002',
    caseTitle: 'WhatsApp Investment Scam',
    reportType: 'Evidence Analysis Report',
    createdDate: '2026-08-26 11:20',
    status: 'Generated',
    author: 'Inspector Vikram Singh',
    downloadUrl: '#',
    summary: 'Detailed financial trail of mule bank accounts and international WhatsApp admin accounts.'
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 'NT-01',
    title: 'Evidence Analysis Completed',
    message: 'OCR & Entity extraction finished for whatsapp_chat_01.png (Case CV-2026-001).',
    timestamp: '10 mins ago',
    type: 'success',
    read: false,
    link: '/evidence/EVD-001'
  },
  {
    id: 'NT-02',
    title: 'High-Risk Indicator Detected',
    message: 'Geolocation match to Jamtara cyber cluster detected in upi_receipt_statement.pdf.',
    timestamp: '45 mins ago',
    type: 'warning',
    read: false,
    link: '/evidence/EVD-002'
  },
  {
    id: 'NT-03',
    title: 'New Case Assigned',
    message: 'You have been assigned as lead investigator for Case CV-2026-003.',
    timestamp: '3 hours ago',
    type: 'info',
    read: true,
    link: '/cases/CV-2026-003'
  }
];

export const MOCK_AI_RESPONSES = {
  "summarize": `Based on the ingested evidence for Case CV-2026-001 (UPI Payment Fraud):

1. **Incident Summary**: The victim, Rajesh Sharma, was targeted on 14-Aug-2026 via WhatsApp by suspect line +91 98123 45678 impersonating Paytm Care.
2. **Fraud Vector**: Suspect sent a fraudulent link (paytm-claim-cashback-instant.net) and instructed victim to scan a QR code & enter UPI PIN to receive ₹18,500 cashback.
3. **Financial Debit**: Entering PIN resulted in an instant debit of ₹18,500 to beneficiary VPA paytmqr-fastpay@paytm (NPCI Ref: 423891004921).
4. **Geolocation Correlation**: Statement logs link the origin IP (49.37.192.104) to Jamtara, Jharkhand.

*Source Evidence*: [whatsapp_chat_01.png](EVD-001), [upi_receipt_statement.pdf](EVD-002)`,

  "entities": `Identified 7 Key Entities across Case Evidence:

- **Suspect Contact**: \`+91 98123 45678\` (High Risk)
- **Fraud VPA**: \`paytmqr-fastpay@paytm\` (Critical Risk)
- **Mule Entity Name**: \`FASTPAY GLOBAL ENTERPRISES\` (High Risk)
- **Phishing URL**: \`http://paytm-claim-cashback-instant.net/verify\` (Critical Risk)
- **UPI Transaction Ref**: \`423891004921\` (High Risk)
- **Originating IP**: \`49.37.192.104\` (Jamtara Cluster)
- **Victim Details**: \`Rajesh Sharma (+91 98765 43210)\`

*Source Evidence*: [whatsapp_chat_01.png](EVD-001), [upi_receipt_statement.pdf](EVD-002)`,

  "timeline": `Chronological Events Sequence:

- **11:15 AM**: Initial WhatsApp message from suspect (+91 98123 45678).
- **11:18 AM**: Malicious QR link paytm-claim-cashback-instant.net delivered.
- **11:20 AM**: Debited ₹18,500 via HDFC Bank A/C to paytmqr-fastpay@paytm.
- **11:22 AM**: Suspect blocks victim number.
- **02:10 PM**: Cyber Crime Portal Complaint filed.

*Source Evidence*: [whatsapp_chat_01.png](EVD-001)`,

  "urls": `Detected Malicious URLs:

1. **\`http://paytm-claim-cashback-instant.net/verify\`**
   - **Risk Score**: 91/100 (Critical)
   - **Domain Registration Date**: 2026-08-12 (2 days prior to incident)
   - **Registrar**: Anonymous offshore privacy shield
   - **Identified Threat**: Phishing / Credential & QR PIN Capture

*Source Evidence*: [whatsapp_chat_01.png](EVD-001)`
};
