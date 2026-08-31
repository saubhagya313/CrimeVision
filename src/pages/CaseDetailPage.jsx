import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Folder,
  Upload,
  Cpu,
  FileCheck,
  Clock,
  Bot,
  User,
  Shield,
  Filter,
  ArrowLeft,
  Activity,
  FileText
} from 'lucide-react';
import RiskBadge from '../components/common/RiskBadge';
import RiskScore from '../components/common/RiskScore';
import EvidenceCard from '../components/evidence/EvidenceCard';
import EmptyState from '../components/common/EmptyState';
import { casesApi, evidenceApi } from '../services/api';
import { useCase } from '../context/CaseContext';

const CaseDetailPage = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { evidenceList } = useCase();

  const [currentCase, setCurrentCase] = useState(null);
  const [caseEvidence, setCaseEvidence] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const c = await casesApi.getCaseById(caseId || 'CV-2026-001');
        setCurrentCase(c);
        const ev = await evidenceApi.getEvidence({ caseId: c.id });
        setCaseEvidence(ev);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [caseId, evidenceList]);

  if (loading || !currentCase) {
    return (
      <div className="p-12 text-center font-mono text-cyan-400 animate-pulse">
        Fetching Forensic Docket Files for {caseId}...
      </div>
    );
  }

  const filteredEvidence = activeTab === 'All'
    ? caseEvidence
    : caseEvidence.filter(e => e.fileType.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Top Breadcrumb */}
      <button
        onClick={() => navigate('/cases')}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Cases
      </button>

      {/* Case Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-500/40">
                {currentCase.id}
              </span>
              <RiskBadge level={currentCase.riskLevel} />
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700">
                {currentCase.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              {currentCase.title}
            </h1>
            <p className="text-xs font-mono text-slate-400">
              Created: {currentCase.createdDate} • Last Activity: {currentCase.lastUpdated}
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/evidence/upload')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Upload Evidence</span>
            </button>

            <button
              onClick={() => navigate(`/analysis/${currentCase.id}`)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 text-xs font-mono transition-colors flex items-center gap-2"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Run AI Analysis</span>
            </button>

            <button
              onClick={() => navigate(`/reports/new?caseId=${currentCase.id}`)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider shadow-cyan-glow transition-all flex items-center gap-2"
            >
              <FileCheck className="w-4 h-4" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>

        {/* Quick Navigation Toolbar to Timeline / AI Assistant */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/timeline/${currentCase.id}`)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>View Investigation Timeline</span>
            </button>

            <button
              onClick={() => navigate('/ai-assistant')}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ask CrimeVision AI</span>
            </button>
          </div>

          <span className="text-slate-400">
            Case Type: <strong className="text-cyan-300">{currentCase.caseType}</strong>
          </span>
        </div>
      </div>

      {/* Case Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Case Info Card */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono border-b border-slate-800 pb-2">
            Case Details & Victim Scope
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            {currentCase.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800/80 font-mono text-xs">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase">Complainant / Victim</span>
              <p className="font-semibold text-slate-200">{currentCase.victimInfo.name}</p>
              <p className="text-slate-400 text-[11px]">{currentCase.victimInfo.phone}</p>
              <p className="text-slate-400 text-[11px]">{currentCase.victimInfo.email}</p>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase">Incident Timestamp</span>
              <p className="font-semibold text-slate-200">{currentCase.incidentDate}</p>
              <p className="text-slate-400 text-[11px]">Priority: {currentCase.priority}</p>
            </div>
          </div>
        </div>

        {/* Risk Assessment Score Card */}
        <RiskScore score={currentCase.riskScore || 87} level={currentCase.riskLevel} />
      </div>

      {/* Case Evidence Directory Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
              Associated Digital Evidence ({caseEvidence.length})
            </h3>
            <p className="text-xs text-slate-400">All evidence uploaded and analyzed for this case</p>
          </div>

          {/* Evidence Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <Filter className="w-4 h-4 text-cyan-400 flex-shrink-0 mr-1" />
            {['All', 'Images', 'Chats', 'Emails', 'PDFs', 'Transactions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-semibold shadow-cyan-glow'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Evidence Grid */}
        {filteredEvidence.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredEvidence.map((ev) => (
              <EvidenceCard key={ev.id} evidence={ev} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Evidence Ingested Yet"
            description="No evidence files have been uploaded for this case under this filter category."
            actionText="Upload Digital Evidence"
            onAction={() => navigate('/evidence/upload')}
          />
        )}
      </div>
    </div>
  );
};

export default CaseDetailPage;
