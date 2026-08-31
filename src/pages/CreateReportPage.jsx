import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FileCheck, ArrowLeft, CheckSquare, Sparkles } from 'lucide-react';
import { useCase } from '../context/CaseContext';
import { reportsApi } from '../services/api';

const reportTypes = [
  'Complete Case Report',
  'Investigation Summary',
  'Evidence Analysis Report',
  'Cyber Crime Complaint Draft',
  'Incident Timeline'
];

const CreateReportPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cases, showToast } = useCase();

  const preselectedCaseId = searchParams.get('caseId');

  const [selectedCaseId, setSelectedCaseId] = useState(preselectedCaseId || (cases[0]?.id || 'CV-2026-001'));
  const [reportType, setReportType] = useState('Complete Case Report');
  const [options, setOptions] = useState({
    includeTimeline: true,
    includeEntities: true,
    includeRiskAnalysis: true,
    includeEvidenceRefs: true,
    includeAISummary: true
  });
  const [building, setBuilding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBuilding(true);
    try {
      const report = await reportsApi.generateReport({
        caseId: selectedCaseId,
        reportType,
        options
      });
      showToast(`Report ${report.id} generated successfully!`, 'success');
      navigate(`/reports/${report.id}`);
    } catch (err) {
      showToast('Failed to generate report', 'error');
    } finally {
      setBuilding(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in font-sans">
      <button
        onClick={() => navigate('/reports')}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Reports Directory
      </button>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center gap-3">
        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
          <FileCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-100">Configure Official Forensic Report</h1>
          <p className="text-xs text-slate-400">
            Select case, report scope, and automated inclusion modules
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        {/* Section 1: Scope */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-2">
            1. Report Scope & Template
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Target Investigation Case</label>
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
              >
                {cases.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.id} — {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Report Document Template</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
              >
                {reportTypes.map(rt => (
                  <option key={rt} value={rt}>{rt}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Inclusion Options */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-2">
            2. Content Modules & Section Inclusion
          </h3>

          <div className="space-y-3 font-mono text-xs text-slate-300">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-cyan-500/40 transition-colors">
              <input
                type="checkbox"
                checked={options.includeTimeline}
                onChange={(e) => setOptions({ ...options, includeTimeline: e.target.checked })}
                className="rounded bg-slate-900 border-slate-700 text-cyan-500"
              />
              <span>Include Chronological Incident Timeline</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-cyan-500/40 transition-colors">
              <input
                type="checkbox"
                checked={options.includeEntities}
                onChange={(e) => setOptions({ ...options, includeEntities: e.target.checked })}
                className="rounded bg-slate-900 border-slate-700 text-cyan-500"
              />
              <span>Include Extracted Entities (Phones, VPAs, URLs, NPCI Refs)</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-cyan-500/40 transition-colors">
              <input
                type="checkbox"
                checked={options.includeRiskAnalysis}
                onChange={(e) => setOptions({ ...options, includeRiskAnalysis: e.target.checked })}
                className="rounded bg-slate-900 border-slate-700 text-cyan-500"
              />
              <span>Include Automated Fraud Risk Matrix & Contributing Factors</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-cyan-500/40 transition-colors">
              <input
                type="checkbox"
                checked={options.includeEvidenceRefs}
                onChange={(e) => setOptions({ ...options, includeEvidenceRefs: e.target.checked })}
                className="rounded bg-slate-900 border-slate-700 text-cyan-500"
              />
              <span>Include Digital Evidence Hash & File Checksum Audit</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-cyan-500/40 transition-colors">
              <input
                type="checkbox"
                checked={options.includeAISummary}
                onChange={(e) => setOptions({ ...options, includeAISummary: e.target.checked })}
                className="rounded bg-slate-900 border-slate-700 text-cyan-500"
              />
              <span>Include AI Forensic Synthesis Executive Summary</span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/reports')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-mono text-xs transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={building}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider shadow-cyan-glow transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{building ? 'Building Dossier Document...' : 'Generate Official Report'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReportPage;
