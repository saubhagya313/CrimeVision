import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Trash2,
  ArrowRight,
  Printer,
  Sparkles,
  CreditCard,
  RefreshCw,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { analysisApi, complaintsApi } from '../services/api';
import AnalysisReportModal from '../components/common/AnalysisReportModal';

const MyAnalysesPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analyses'); // 'analyses' | 'drafts'
  const [loading, setLoading] = useState(true);
  const [analyses, setAnalyses] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [selectedReportAnalysis, setSelectedReportAnalysis] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [analysesData, draftsData] = await Promise.all([
        analysisApi.getMyAnalyses(),
        complaintsApi.getMyDrafts(),
      ]);
      setAnalyses(analysesData || []);
      setDrafts(draftsData || []);
    } catch (err) {
      console.warn('Error loading history:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteAnalysis = async (id) => {
    if (!window.confirm('Are you sure you want to delete this analysis record?')) return;
    try {
      await analysisApi.deleteAnalysis(id);
      setAnalyses(analyses.filter((a) => a.analysisId !== id && a._id !== id));
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleDeleteDraft = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint draft?')) return;
    try {
      await complaintsApi.deleteDraft(id);
      setDrafts(drafts.filter((d) => d.draftId !== id && d._id !== id));
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  // Filter analyses
  const filteredAnalyses = analyses.filter((item) => {
    const matchesRisk =
      riskFilter === 'All'
        ? true
        : riskFilter === 'High'
        ? item.riskLevel === 'High' || item.riskLevel === 'Critical'
        : item.riskLevel === riskFilter;

    const matchesSearch =
      !searchQuery ||
      item.predictedCategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.extractedText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.analysisId?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRisk && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            My Analyses & Complaint Drafts
          </h1>
          <p className="text-sm text-slate-400">
            Review your past digital evidence analyses, extracted suspect parameters, and generated police complaints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/analyze')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-cyan-glow flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>New Analysis</span>
          </button>
          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-800 pb-3 gap-2">
        <button
          onClick={() => setActiveTab('analyses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'analyses'
              ? 'bg-cyan-500 text-slate-950 shadow-cyan-glow'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Evidence Analyses ({analyses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('drafts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'drafts'
              ? 'bg-cyan-500 text-slate-950 shadow-cyan-glow'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Generated Complaint Drafts ({drafts.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. ANALYSES LIST TAB */}
      {/* ========================================================================= */}
      {activeTab === 'analyses' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="p-4 rounded-xl glass-panel border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by threat category, text keyword, or scan ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-slate-400 text-[11px] mr-1">Risk:</span>
              {['All', 'High', 'Medium', 'Low'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRiskFilter(r)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    riskFilter === r
                      ? 'bg-slate-700 text-cyan-400 border border-cyan-500/40'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {filteredAnalyses.length === 0 ? (
            <div className="p-8 rounded-2xl glass-panel border border-slate-800 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-300">No analyses matching criteria</p>
              <p className="text-xs text-slate-400">Scan screenshots or text to build your analysis record.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAnalyses.map((item) => {
                const isHigh = item.riskLevel === 'Critical' || item.riskLevel === 'High';
                return (
                  <div
                    key={item._id || item.analysisId}
                    className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-slate-700 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          {item.analysisId}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                            isHigh
                              ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                              : item.riskLevel === 'Medium'
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          }`}
                        >
                          {item.riskLevel.toUpperCase()} ({item.riskScore}%)
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-200 line-clamp-1">
                        {item.predictedCategory}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-mono">
                        {item.extractedText}
                      </p>

                      {item.entities && item.entities.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {item.entities.slice(0, 3).map((e, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-cyan-300 border border-slate-700 truncate max-w-[150px]"
                            >
                              {e.value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedReportAnalysis(item)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono text-[10px] font-semibold border border-slate-700 transition-colors"
                        >
                          Technical Report
                        </button>
                        <button
                          onClick={() => navigate('/complaint-generator', { state: { analysis: item } })}
                          className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
                        >
                          Draft Complaint →
                        </button>
                        <button
                          onClick={() => handleDeleteAnalysis(item.analysisId || item._id)}
                          className="p-1 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. COMPLAINT DRAFTS LIST TAB */}
      {/* ========================================================================= */}
      {activeTab === 'drafts' && (
        <div className="space-y-4">
          {drafts.length === 0 ? (
            <div className="p-8 rounded-2xl glass-panel border border-slate-800 text-center space-y-3">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No complaint drafts generated yet</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                After analyzing evidence, click 'Generate Complaint Draft' to create formal police complaint drafts.
              </p>
              <button
                onClick={() => navigate('/complaint-generator')}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider"
              >
                Create Custom Draft
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {drafts.map((draft) => (
                <div
                  key={draft._id || draft.draftId}
                  className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-slate-700 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold text-cyan-400">
                        {draft.draftId}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {draft.status || 'DRAFT'}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-200">
                      {draft.incidentInfo?.incidentType || 'Cyber Fraud Complaint'}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {draft.incidentInfo?.description}
                    </p>

                    <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Loss Amount</span>
                        <span className="text-rose-400 font-bold">
                          ₹{draft.incidentInfo?.financialLoss || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Police Station</span>
                        <span className="text-slate-300 truncate block">
                          {draft.policeStation?.name || 'Local Police'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(draft.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate('/complaint-generator', { state: { draft } })}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-cyan-glow"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print / Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteDraft(draft.draftId || draft._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Technical Analysis Report Modal */}
      {selectedReportAnalysis && (
        <AnalysisReportModal
          analysis={selectedReportAnalysis}
          onClose={() => setSelectedReportAnalysis(null)}
          onGenerateComplaint={(anl) =>
            navigate('/complaint-generator', {
              state: {
                analysis: anl,
              },
            })
          }
        />
      )}
    </div>
  );
};

export default MyAnalysesPage;
