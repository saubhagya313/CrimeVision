import React, { useState, useEffect } from 'react';
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ShieldAlert,
  RefreshCw,
  Activity,
  Lock,
} from 'lucide-react';
import { analysisApi } from '../../services/api';

const AdminAnalysesPage = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await analysisApi.getAdminAnalyses();
      setAnalyses(res?.data || []);
    } catch (err) {
      console.warn('Failed to load admin analyses:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = analyses.filter((item) => {
    const matchesRisk =
      riskFilter === 'All'
        ? true
        : riskFilter === 'High'
        ? item.riskLevel === 'High' || item.riskLevel === 'Critical'
        : item.riskLevel === riskFilter;

    const matchesSearch =
      !searchQuery ||
      item.predictedCategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.analysisId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userName?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRisk && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-medium mb-1">
            <Activity className="w-3.5 h-3.5" />
            <span>Aggregate Telemetry & Threat Surveillance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Analysis Monitoring
          </h1>
          <p className="text-xs text-slate-400">
            Aggregate statistics and system scans across CrimeVision (Privacy-protected: personal citizen chat text is not exposed).
          </p>
        </div>

        <button
          onClick={loadData}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-2 text-xs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Privacy Notice */}
      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs text-slate-400 font-mono">
        <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>Privacy Protection Active: Only diagnostic metadata, categories, and entity counts are shown to administrators.</span>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Scan ID, category, or user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-slate-400 text-[11px] mr-1">Risk:</span>
          {['All', 'High', 'Medium', 'Low'].map((r) => (
            <button
              key={r}
              onClick={() => setRiskFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                riskFilter === r
                  ? 'bg-cyan-500 text-slate-950 shadow-cyan-glow'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Analyses Table */}
      <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 border-b border-slate-800 font-mono text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Scan ID</th>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Source Type</th>
                <th className="py-3.5 px-4">Threat Category</th>
                <th className="py-3.5 px-4">Risk Rating</th>
                <th className="py-3.5 px-4 text-center">Confidence</th>
                <th className="py-3.5 px-4 text-center">Entities</th>
                <th className="py-3.5 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-sans">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No analyses matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const isHigh = item.riskLevel === 'Critical' || item.riskLevel === 'High';
                  return (
                    <tr key={item._id || item.analysisId} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                        {item.analysisId}
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-300">
                        {item.userName || 'Citizen'}
                      </td>

                      <td className="py-3.5 px-4 text-slate-400">
                        {item.sourceType || 'Text'}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-200">
                        {item.predictedCategory}
                      </td>

                      <td className="py-3.5 px-4">
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
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-200">
                        {item.confidence}%
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono text-cyan-400 font-bold">
                        {item.entities?.length || 0}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                        })}{' '}
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalysesPage;
