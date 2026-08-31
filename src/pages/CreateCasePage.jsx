import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderPlus, ArrowLeft, Shield, User, Calendar, FileText } from 'lucide-react';
import { useCase } from '../context/CaseContext';

const caseTypes = [
  'Online Payment Fraud',
  'Phishing',
  'Investment Scam',
  'Identity Theft',
  'Social Media Fraud',
  'E-commerce Fraud',
  'Other'
];

const CreateCasePage = () => {
  const { addCase } = useCase();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    caseType: 'Online Payment Fraud',
    priority: 'High',
    status: 'Active',
    incidentDate: new Date().toISOString().split('T')[0],
    victimName: '',
    victimPhone: '',
    victimEmail: '',
    victimAddress: ''
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const created = await addCase(formData);
      navigate(`/cases/${created.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in font-sans">
      {/* Top Navigation */}
      <button
        onClick={() => navigate('/cases')}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Cases Directory
      </button>

      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <FolderPlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">Initiate New Cyber Crime Investigation</h1>
            <p className="text-xs text-slate-400">Record incident scope, victim details, and open forensic docket</p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        {/* Section 1: Case Details */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-2">
            1. Case Primary Information
          </h3>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">Case Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. UPI QR Payment Scam - Target Account FastPay"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-sans text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Case Type</label>
              <select
                value={formData.caseType}
                onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
              >
                {caseTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Priority Level</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Incident Date</label>
              <input
                type="date"
                required
                value={formData.incidentDate}
                onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">Detailed Case Description</label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide a comprehensive summary of how the fraud occurred, suspicious numbers, and initial victim statements..."
              className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-sans text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Section 2: Victim Information */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-2">
            2. Complainant / Victim Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Victim Full Name *</label>
              <input
                type="text"
                required
                value={formData.victimName}
                onChange={(e) => setFormData({ ...formData, victimName: e.target.value })}
                placeholder="Rajesh Sharma"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-sans text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.victimPhone}
                onChange={(e) => setFormData({ ...formData, victimPhone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Email Address</label>
              <input
                type="email"
                value={formData.victimEmail}
                onChange={(e) => setFormData({ ...formData, victimEmail: e.target.value })}
                placeholder="victim@example.com"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/cases')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-mono text-xs transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider shadow-cyan-glow transition-all"
          >
            {submitting ? 'Creating Case...' : 'Create Case Docket'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCasePage;
