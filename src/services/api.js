import axios from 'axios';
import {
  MOCK_USER,
  MOCK_STATS,
  MOCK_CASES,
  MOCK_EVIDENCE,
  MOCK_TIMELINE,
  MOCK_REPORTS,
  MOCK_NOTIFICATIONS,
  MOCK_AI_RESPONSES
} from './mockData';

// Axios Instance configured for future FastAPI integration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Helper for simulated delay
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

// Central Local State for in-memory mutation
let casesState = [...MOCK_CASES];
let evidenceState = [...MOCK_EVIDENCE];
let timelineState = [...MOCK_TIMELINE];
let reportsState = [...MOCK_REPORTS];
let notificationsState = [...MOCK_NOTIFICATIONS];

export const authApi = {
  login: async (email, password) => {
    await delay(600);
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }
    return {
      token: 'mock-jwt-token-crimevision-2026',
      user: { ...MOCK_USER, email }
    };
  },

  register: async (userData) => {
    await delay(700);
    return {
      token: 'mock-jwt-token-new-reg-2026',
      user: {
        id: `usr_${Date.now()}`,
        name: userData.fullName || 'Investigator',
        email: userData.email,
        role: 'Cyber Crime Investigator',
        organization: userData.organization || 'State Police',
        department: 'Cyber Forensics Unit'
      }
    };
  },

  forgotPassword: async (email) => {
    await delay(500);
    return { success: true, message: `Password reset link sent to ${email}` };
  },

  getCurrentUser: async () => {
    await delay(200);
    return MOCK_USER;
  }
};

export const casesApi = {
  getCases: async (filters = {}) => {
    await delay(300);
    let filtered = [...casesState];
    if (filters.status && filters.status !== 'All') {
      if (filters.status === 'High Risk') {
        filtered = filtered.filter(c => c.riskLevel === 'High' || c.riskLevel === 'Critical');
      } else {
        filtered = filtered.filter(c => c.status === filters.status);
      }
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(c =>
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.victimInfo.name.toLowerCase().includes(q)
      );
    }
    return filtered;
  },

  getCaseById: async (id) => {
    await delay(300);
    const found = casesState.find(c => c.id === id);
    if (!found) throw new Error(`Case ${id} not found`);
    return found;
  },

  createCase: async (caseData) => {
    await delay(600);
    const newCase = {
      id: `CV-2026-00${casesState.length + 1}`,
      title: caseData.title,
      description: caseData.description,
      caseType: caseData.caseType || 'Online Payment Fraud',
      riskLevel: caseData.priority === 'Critical' ? 'Critical' : (caseData.priority === 'High' ? 'High' : 'Medium'),
      riskScore: caseData.priority === 'Critical' ? 92 : 75,
      status: caseData.status || 'Active',
      priority: caseData.priority || 'High',
      createdDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 16),
      evidenceCount: 0,
      victimInfo: {
        name: caseData.victimName || 'Unknown Victim',
        phone: caseData.victimPhone || 'N/A',
        email: caseData.victimEmail || 'N/A',
        address: caseData.victimAddress || 'N/A'
      },
      incidentDate: caseData.incidentDate || new Date().toISOString().split('T')[0]
    };
    casesState.unshift(newCase);
    return newCase;
  },

  updateCase: async (id, updates) => {
    await delay(400);
    const idx = casesState.findIndex(c => c.id === id);
    if (idx !== -1) {
      casesState[idx] = { ...casesState[idx], ...updates, lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 16) };
      return casesState[idx];
    }
    throw new Error('Case not found');
  },

  deleteCase: async (id) => {
    await delay(300);
    casesState = casesState.filter(c => c.id !== id);
    return { success: true, id };
  }
};

export const evidenceApi = {
  getEvidence: async (filters = {}) => {
    await delay(300);
    let filtered = [...evidenceState];
    if (filters.caseId) {
      filtered = filtered.filter(e => e.caseId === filters.caseId);
    }
    if (filters.fileType && filters.fileType !== 'All') {
      filtered = filtered.filter(e => e.fileType.toLowerCase() === filters.fileType.toLowerCase());
    }
    return filtered;
  },

  getEvidenceById: async (id) => {
    await delay(300);
    const found = evidenceState.find(e => e.id === id);
    if (!found) throw new Error(`Evidence ${id} not found`);
    return found;
  },

  uploadEvidence: async (fileData, progressCallback) => {
    // Simulate real-time uploading & OCR processing steps
    if (progressCallback) progressCallback({ status: 'Uploading...', percent: 25 });
    await delay(600);
    if (progressCallback) progressCallback({ status: 'OCR Processing...', percent: 65 });
    await delay(800);
    if (progressCallback) progressCallback({ status: 'Analyzing...', percent: 90 });
    await delay(600);

    const newEvidence = {
      id: `EVD-00${evidenceState.length + 1}`,
      caseId: fileData.caseId || 'CV-2026-001',
      fileName: fileData.fileName || 'uploaded_evidence_document.png',
      fileType: fileData.fileType || 'Images',
      mimeType: fileData.mimeType || 'image/png',
      fileSize: fileData.fileSize || '1.8 MB',
      uploadDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      processingStatus: 'Analyzed',
      riskLevel: 'High',
      riskScore: 82,
      hash: `sha256:${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600',
      ocrText: `OCR EXTRACTED CONTENT:
Detected suspect line (+91 99000 11223) demanding transfer to UPI ID cyber-mule@okaxis.
Transaction reference code: 991823004112.
Date: ${new Date().toISOString().split('T')[0]}`,
      extractedEntities: [
        { type: 'Phone', value: '+91 99000 11223', label: 'Extracted Mobile', risk: 'High' },
        { type: 'UPI_ID', value: 'cyber-mule@okaxis', label: 'Suspicious VPA', risk: 'Critical' },
        { type: 'Transaction_ID', value: '991823004112', label: 'Txn Ref', risk: 'High' }
      ],
      fraudIndicators: [
        {
          name: 'High-Velocity UPI Request',
          explanation: 'Extracted phone number linked to multiple unresolved cyber complaints.',
          confidence: 89,
          weight: 25,
          reference: 'Extracted Mobile +91 99000 11223'
        }
      ]
    };

    evidenceState.unshift(newEvidence);

    // Update case evidence count
    const targetCase = casesState.find(c => c.id === newEvidence.caseId);
    if (targetCase) {
      targetCase.evidenceCount += 1;
    }

    if (progressCallback) progressCallback({ status: 'Completed', percent: 100 });
    return newEvidence;
  }
};

export const analysisApi = {
  runAnalysis: async ({ caseId, evidenceId, analysisType }) => {
    await delay(1200);
    return {
      caseId,
      evidenceId,
      analysisType: analysisType || 'Fraud Detection',
      riskScore: 88,
      riskLevel: 'High',
      summary: `Automated AI analysis completed for ${analysisType}. Scanned 12 textual entities and 4 payment tokens. Identified 3 high-confidence fraud indicators including QR PIN misdirection and Jamtara IP resolution.`,
      detectedIndicators: [
        { name: 'PIN Prompt Misdirection', confidence: 98, weight: 28 },
        { name: 'Urgency & High Pressure Language', confidence: 94, weight: 25 },
        { name: 'Offshore Phishing URL Domain', confidence: 91, weight: 20 }
      ],
      entitiesCount: 7,
      scannedDate: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
  }
};

export const timelineApi = {
  getTimeline: async (caseId, filterCategory = 'All') => {
    await delay(300);
    let events = timelineState.filter(e => !caseId || e.caseId === caseId);
    if (filterCategory && filterCategory !== 'All' && filterCategory !== 'All Events') {
      events = events.filter(e => e.category.toLowerCase() === filterCategory.toLowerCase());
    }
    return events;
  }
};

export const aiApi = {
  sendMessage: async (message, caseId) => {
    await delay(900);
    const q = message.toLowerCase();
    let text = MOCK_AI_RESPONSES.summarize;

    if (q.includes('entity') || q.includes('phone') || q.includes('number') || q.includes('upi')) {
      text = MOCK_AI_RESPONSES.entities;
    } else if (q.includes('timeline') || q.includes('sequence') || q.includes('when')) {
      text = MOCK_AI_RESPONSES.timeline;
    } else if (q.includes('url') || q.includes('link') || q.includes('website')) {
      text = MOCK_AI_RESPONSES.urls;
    }

    return {
      id: `msg_${Date.now()}`,
      sender: 'ai',
      text,
      sources: [
        { name: 'whatsapp_chat_01.png', evidenceId: 'EVD-001' },
        { name: 'upi_receipt_statement.pdf', evidenceId: 'EVD-002' }
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
};

export const reportsApi = {
  getReports: async () => {
    await delay(300);
    return reportsState;
  },

  getReportById: async (id) => {
    await delay(300);
    const found = reportsState.find(r => r.id === id);
    if (found) return found;
    return reportsState[0];
  },

  generateReport: async (reportConfig) => {
    await delay(1200);
    const targetCase = casesState.find(c => c.id === reportConfig.caseId) || casesState[0];
    const newReport = {
      id: `REP-2026-0${reportsState.length + 90}`,
      caseId: targetCase.id,
      caseTitle: targetCase.title,
      reportType: reportConfig.reportType || 'Complete Case Report',
      createdDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Generated',
      author: MOCK_USER.name,
      downloadUrl: '#',
      summary: `Automated investigation report generated for ${targetCase.title} including extracted entities, timeline event reconstruction, and fraud risk scores.`
    };
    reportsState.unshift(newReport);
    return newReport;
  }
};

export const statsApi = {
  getStats: async () => {
    await delay(200);
    return MOCK_STATS;
  },

  getNotifications: async () => {
    await delay(200);
    return notificationsState;
  }
};
