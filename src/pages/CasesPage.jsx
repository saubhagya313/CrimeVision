import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderLock, Search, Plus, Filter, ChevronRight, Trash2, Eye } from 'lucide-react';
import RiskBadge from '../components/common/RiskBadge';
import EmptyState from '../components/common/EmptyState';
import { useCase } from '../context/CaseContext';

const filterTabs = ['All', 'Active', 'Under Review', 'Completed', 'High Risk'];

const CasesPage = () => {
  const { cases, loadingCases } = useCase();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCases = cases.filter(c => {
    // Filter by tab
    if (activeFilter === 'Active' && c.status !== 'Active') return false;
    if (activeFilter === 'Under Review' && c.status !== 'Under Review') return false;
    if (activeFilter === 'Completed' && c.status !== 'Completed') return false;
    if (activeFilter === 'High Risk' && !(c.riskLevel === 'High' || c.riskLevel === 'Critical')) return false;

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.victimInfo.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderLock className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-slate-100">Cyber Crime Cases</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Manage, track, and investigate active cyber crime dockets</p>
        </div>

        <button
          onClick={() => navigate('/cases/new')}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider shadow-cyan-glow transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Case</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-4 h-4 text-cyan-400 flex-shrink-0 mr-1" />
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs whitespace-nowrap transition-all ${
                activeFilter === tab
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-semibold shadow-cyan-glow'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-cyan-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search case ID, title, victim..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Cases Table */}
      {filteredCases.length > 0 ? (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider bg-slate-900/60">
                  <th className="py-3.5 px-4">Case ID</th>
                  <th className="py-3.5 px-4">Title & Type</th>
                  <th className="py-3.5 px-4">Victim</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4">Evidence Count</th>
                  <th className="py-3.5 px-4">Risk Level</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-cyan-400">{c.id}</td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-slate-200">{c.title}</p>
                      <p className="text-[10px] font-mono text-slate-500 mt-0.5">{c.caseType}</p>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-300">
                      <div>{c.victimInfo.name}</div>
                      <div className="text-[10px] text-slate-500">{c.victimInfo.phone}</div>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-400">{c.createdDate}</td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-200">{c.evidenceCount} Files</td>
                    <td className="py-4 px-4">
                      <RiskBadge level={c.riskLevel} />
                    </td>
                    <td className="py-4 px-4 font-mono">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        c.status === 'Active'
                          ? 'bg-cyan-950 text-cyan-400 border-cyan-500/40'
                          : c.status === 'Under Review'
                          ? 'bg-amber-950 text-amber-400 border-amber-500/40'
                          : 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => navigate(`/cases/${c.id}`)}
                        className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono text-xs transition-colors"
                      >
                        View Case →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No Cases Found"
          description="No investigations match your selected criteria. Create a new case to start analyzing evidence."
          actionText="Create Your First Case"
          onAction={() => navigate('/cases/new')}
        />
      )}
    </div>
  );
};

export default CasesPage;
