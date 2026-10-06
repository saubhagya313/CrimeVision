import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

const getAuthHeaders = () => {
  const token = localStorage.getItem('crimevision_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ==========================================
// 1. AUTHENTICATION & PROFILE API
// ==========================================
export const authApi = {
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (error.message === 'Network Error'
          ? 'Cannot connect to backend server. Make sure backend is running on port 5000.'
          : error.message);
      throw new Error(errorMsg);
    }
  },

  register: async ({ name, email, password, phone, address, city, state, pincode }) => {
    try {
      const response = await apiClient.post('/auth/register', {
        name,
        email,
        password,
        phone,
        address,
        city,
        state,
        pincode,
        role: 'User',
      });
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (error.message === 'Network Error'
          ? 'Cannot connect to backend server. Make sure backend is running on port 5000.'
          : error.message);
      throw new Error(errorMsg);
    }
  },

  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('crimevision_token');
      if (!token) return null;
      const response = await apiClient.get('/auth/me', {
        headers: getAuthHeaders(),
      });
      return response.data.user;
    } catch (error) {
      return null;
    }
  },

  forgotPassword: async (email) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },
};

// ==========================================
// 2. EVIDENCE ANALYSIS & OCR & ML API
// ==========================================
export const analysisApi = {
  scanEvidence: async ({ text, sourceType, fileName, fileUrl, fileHash, imageQuality, forceReScan }) => {
    try {
      const response = await apiClient.post(
        '/analysis/scan',
        { text, sourceType, fileName, fileUrl, fileHash, imageQuality, forceReScan },
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  submitFeedback: async (id, feedbackData) => {
    try {
      const response = await apiClient.post(
        `/analysis/${id}/feedback`,
        feedbackData,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  getMyAnalyses: async (filters = {}) => {
    try {
      const response = await apiClient.get('/analysis/my-analyses', {
        headers: getAuthHeaders(),
        params: filters,
      });
      return response.data.data || [];
    } catch (error) {
      console.warn('Error fetching my analyses:', error.message);
      return [];
    }
  },

  getAnalysisById: async (id) => {
    try {
      const response = await apiClient.get(`/analysis/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  deleteAnalysis: async (id) => {
    try {
      const response = await apiClient.delete(`/analysis/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  getAdminAnalyses: async () => {
    try {
      const response = await apiClient.get('/analysis/admin/all', {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  sendAnalysisEmail: async (id) => {
    try {
      const response = await apiClient.post(
        `/analysis/${id}/send-email`,
        {},
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};

// ==========================================
// 3. COMPLAINT DRAFT GENERATOR API
// ==========================================
export const complaintsApi = {
  createDraft: async (draftData) => {
    try {
      const response = await apiClient.post('/complaints/draft', draftData, {
        headers: getAuthHeaders(),
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  getMyDrafts: async () => {
    try {
      const response = await apiClient.get('/complaints/my-drafts', {
        headers: getAuthHeaders(),
      });
      return response.data.data || [];
    } catch (error) {
      console.warn('Error fetching complaint drafts:', error.message);
      return [];
    }
  },

  getDraftById: async (id) => {
    try {
      const response = await apiClient.get(`/complaints/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  updateDraft: async (id, updates) => {
    try {
      const response = await apiClient.put(`/complaints/${id}`, updates, {
        headers: getAuthHeaders(),
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  deleteDraft: async (id) => {
    try {
      const response = await apiClient.delete(`/complaints/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  getAdminComplaints: async () => {
    try {
      const response = await apiClient.get('/complaints/admin/all', {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  sendComplaintEmail: async (id) => {
    try {
      const response = await apiClient.post(
        `/complaints/${id}/send-email`,
        {},
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};

// ==========================================
// 4. ADMIN MANAGEMENT & MONITORING API
// ==========================================
export const adminApi = {
  getUsers: async (filters = {}) => {
    try {
      const response = await apiClient.get('/admin/users', {
        headers: getAuthHeaders(),
        params: filters,
      });
      return response.data.data || [];
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  getUserById: async (id) => {
    try {
      const response = await apiClient.get(`/admin/users/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  toggleUserStatus: async (id, isActive) => {
    try {
      const response = await apiClient.put(
        `/admin/users/${id}/status`,
        { isActive },
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  updateUserRole: async (id, role) => {
    try {
      const response = await apiClient.put(
        `/admin/users/${id}/role`,
        { role },
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  getAdminStats: async () => {
    try {
      const response = await apiClient.get('/admin/stats', {
        headers: getAuthHeaders(),
      });
      return response.data.data;
    } catch (error) {
      console.warn('Failed to fetch admin stats, using fallback:', error.message);
      return null;
    }
  },

  getModelMetrics: async () => {
    try {
      const response = await apiClient.get('/admin/model-metrics', {
        headers: getAuthHeaders(),
      });
      return response.data.data;
    } catch (error) {
      console.warn('Failed to fetch model metrics:', error.message);
      return null;
    }
  },

  getAuditLogs: async (params = {}) => {
    try {
      const response = await apiClient.get('/admin/audit-logs', {
        headers: getAuthHeaders(),
        params,
      });
      return response.data.data || [];
    } catch (error) {
      console.warn('Failed to fetch audit logs:', error.message);
      return [];
    }
  },
};

// ==========================================
// 5. NEARBY POLICE STATION DIRECTORY
// ==========================================
export const POLICE_STATIONS_DATA = [
  {
    id: 'ps-1',
    name: 'Cyber Crime Police Station, Sector 108',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201301',
    address: 'Police Commissionerate Complex, Sector 108, Noida, Uttar Pradesh',
    contact: '0120-2560003 / 1930',
    type: 'Dedicated Cyber Crime Police Station',
    distance: '3.4 km',
    mapsUrl: 'https://maps.google.com/?q=Cyber+Crime+Police+Station+Sector+108+Noida',
    inCharge: 'ACP Cyber Crime Cell',
    email: 'cyberps-noida@uppolice.gov.in',
  },
  {
    id: 'ps-2',
    name: 'Delhi Police Special Cell (IFSO Cyber Unit)',
    city: 'Delhi',
    state: 'Delhi NCR',
    pincode: '110078',
    address: 'Sector 16C, Dwarka, New Delhi, Delhi',
    contact: '011-20892606 / 1930',
    type: 'State Cyber Crime Investigation Unit',
    distance: '7.8 km',
    mapsUrl: 'https://maps.google.com/?q=Delhi+Police+IFSO+Cyber+Cell+Dwarka',
    inCharge: 'DCP Cyber Crime (IFSO)',
    email: 'cybercell-delhi@nic.in',
  },
  {
    id: 'ps-3',
    name: 'Bengaluru Central Cyber Crime Police Station',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    address: 'Infantry Road, Near Police Commissioner Office, Bengaluru, Karnataka',
    contact: '080-22201021 / 1930',
    type: 'Dedicated Cyber Police Station',
    distance: '4.5 km',
    mapsUrl: 'https://maps.google.com/?q=Cyber+Crime+Police+Station+Infantry+Road+Bengaluru',
    inCharge: 'Inspector Cyber Police Station',
    email: 'cybercrimeps-bcp@ksp.gov.in',
  },
  {
    id: 'ps-4',
    name: 'BKC Cyber Police Station, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400051',
    address: 'Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra',
    contact: '022-26504008 / 1930',
    type: 'Metropolitan Cyber Crime Police Station',
    distance: '5.1 km',
    mapsUrl: 'https://maps.google.com/?q=BKC+Cyber+Police+Station+Mumbai',
    inCharge: 'Senior Police Inspector Cyber Cell',
    email: 'cybercell.mumbai@mahapolice.gov.in',
  },
  {
    id: 'ps-5',
    name: 'Cyberabad Cyber Crimes Police Station',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500032',
    address: 'Cyberabad Police Commissionerate, Gachibowli, Hyderabad, Telangana',
    contact: '040-27853412 / 1930',
    type: 'Dedicated Cyber Crime Police Station',
    distance: '6.2 km',
    mapsUrl: 'https://maps.google.com/?q=Cyberabad+Cyber+Crimes+Police+Station+Gachibowli',
    inCharge: 'ACP Cyber Crimes Unit',
    email: 'cybercrimes-cyb@tspolice.gov.in',
  },
  {
    id: 'ps-6',
    name: 'Kolkata Cyber Police Station, Lalbazar',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700001',
    address: 'Kolkata Police HQ, Lalbazar, Kolkata, West Bengal',
    contact: '033-22143000 / 1930',
    type: 'Specialized Cyber Crime Police Station',
    distance: '2.9 km',
    mapsUrl: 'https://maps.google.com/?q=Cyber+Police+Station+Lalbazar+Kolkata',
    inCharge: 'OC Cyber Crime Police Station',
    email: 'cybercell@kolkatapolice.gov.in',
  },
  {
    id: 'ps-7',
    name: 'Cyber Crime Police Station, Shivajinagar, Pune',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411005',
    address: 'Pune City Police Commissionerate, Shivajinagar, Pune, Maharashtra',
    contact: '020-26123342 / 1930',
    type: 'City Cyber Crime Police Station',
    distance: '3.8 km',
    mapsUrl: 'https://maps.google.com/?q=Cyber+Crime+Police+Station+Shivajinagar+Pune',
    inCharge: 'PI Cyber Crime Pune',
    email: 'cybercrime.pune@mahapolice.gov.in',
  },
  {
    id: 'ps-8',
    name: 'Cyber Crime Police Station, Jaipur Police Commissionerate',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302001',
    address: 'Government Hostel Crossing, MI Road, Jaipur, Rajasthan',
    contact: '0141-2373000 / 1930',
    type: 'State Cyber Crime Police Station',
    distance: '4.0 km',
    mapsUrl: 'https://maps.google.com/?q=Cyber+Crime+Police+Station+Jaipur',
    inCharge: 'DySP Cyber Crime Unit',
    email: 'cyber-cell-raj@nic.in',
  },
  {
    id: 'ps-9',
    name: 'Cyber Crime Police Station, Hazratganj, Lucknow',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226001',
    address: 'Old Police Lines, Hazratganj, Lucknow, Uttar Pradesh',
    contact: '0522-2200000 / 1930',
    type: 'Regional Cyber Crime Police Station',
    distance: '3.1 km',
    mapsUrl: 'https://maps.google.com/?q=Cyber+Crime+Police+Station+Hazratganj+Lucknow',
    inCharge: 'Inspector In-charge Cyber Cell',
    email: 'cyberps-lko@uppolice.gov.in',
  },
];

export const searchPoliceStations = (query = '') => {
  if (!query || query.trim() === '') return POLICE_STATIONS_DATA;
  const q = query.toLowerCase().trim();
  return POLICE_STATIONS_DATA.filter(
    (ps) =>
      ps.city.toLowerCase().includes(q) ||
      ps.state.toLowerCase().includes(q) ||
      ps.pincode.includes(q) ||
      ps.name.toLowerCase().includes(q) ||
      ps.address.toLowerCase().includes(q)
  );
};

// ==========================================
// 6. BACKWARDS-COMPATIBILITY EXPORTS
// ==========================================
export const casesApi = {
  getCases: async (params = {}) => {
    try {
      const res = await apiClient.get('/cases', { headers: getAuthHeaders(), params });
      return res.data.data || [];
    } catch {
      return [];
    }
  },
  getCaseById: async (id) => {
    try {
      const res = await apiClient.get(`/cases/${id}`, { headers: getAuthHeaders() });
      return res.data.data;
    } catch {
      return { id, title: 'Case record' };
    }
  },
  createCase: async (c) => {
    const res = await apiClient.post('/cases', c, { headers: getAuthHeaders() });
    return res.data.data || res.data;
  },
  updateCase: async (id, u) => {
    const res = await apiClient.put(`/cases/${id}`, u, { headers: getAuthHeaders() });
    return res.data.data || res.data;
  },
  deleteCase: async (id) => {
    const res = await apiClient.delete(`/cases/${id}`, { headers: getAuthHeaders() });
    return res.data;
  },
  sendResolutionEmail: async (id) => {
    const res = await apiClient.post(`/cases/${id}/send-resolution-email`, {}, { headers: getAuthHeaders() });
    return res.data;
  },
};

export const evidenceApi = {
  getEvidence: async () => [],
  getEvidenceById: async (id) => ({ id, fileName: 'evidence' }),
  uploadEvidence: async (f) => f,
};

export const statsApi = {
  getStats: async () => ({}),
  getNotifications: async () => [],
};
