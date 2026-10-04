import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderLock, Search, Plus, Filter, Shield, Trash2 } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';
import { useCase } from '../context/CaseContext';
import { useAuth } from '../context/AuthContext';
import { casesApi } from '../services/api';

const filterTabs = ['All', 'Submitted', 'Under Review', 'In Progress', 'FIR Registered', 'Resolved'];

const CasesPage = () => {
  const { cases, refreshCases, showToast, removeCase } = useCase();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'Admin' || user?.role === 'Investigator';

  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const handleStatusChange = async (caseId, newStatus) => {
    setUpdatingId(caseId);
    try {
      await casesApi.updateCase(caseId, {
        status: newStatus,
        officerName: user?.name || 'Investigating Officer',
      });
      await refreshCases();
      if (showToast) showToast(`Status updated to "${newStatus}"!`, 'success');
    } catch (err) {
      console.error('Failed to update status', err);
      if (showToast) showToast('Failed to update status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredCases = cases.filter(c => {
    // Filter by tab
    if (activeFilter === 'Submitted' && c.status !== 'Submitted') return false;
    if (activeFilter === 'Under Review' && c.status !== 'Under Review') return false;
    if (activeFilter === 'In Progress' && c.status !== 'In Progress' && c.status !== 'Under Investigation') return false;
    if (activeFilter === 'FIR Registered' && c.status !== 'FIR Registered') return false;
    if (activeFilter === 'Resolved' && (c.status !== 'Resolved' && c.status !== 'Closed')) return false;

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        (c.id || c.caseId || '').toLowerCase().includes(q) ||
        (c.title || '').toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q) ||
        (c.victimInfo?.name || c.userName || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className={`p-6 rounded-2xl border ${
        isAdmin ? 'bg-slate-900 border-amber-500/30' : 'bg-slate-900 border-slate-800'
      } flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
        <div>
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <Shield className="w-5 h-5 text-amber-400" />
            ) : (
              <FolderLock className="w-5 h-5 text-cyan-400" />
            )}
            <h1 className="text-xl font-bold text-slate-100">
              {isAdmin ? 'All Citizen Cyber Complaints' : 'My Filed Cyber Complaints'}
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAdmin
              ? 'Select any complaint to update its status or click dropdown to change directly.'
              : 'Review progress and live status updates on your complaints.'}
          </p>
        </div>

        <button
          onClick={() => navigate('/cases/new')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            isAdmin
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md'
          }`}
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{isAdmin ? '+ Register Case' : '+ File New Complaint'}</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0 mr-1" />
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === tab
                  ? isAdmin
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search complaint ID, victim, keyword..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Cases Table */}
      {filteredCases.length > 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider bg-slate-950/60">
                  <th className="py-3.5 px-3.5">Complaint ID</th>
                  <th className="py-3.5 px-3.5">Title & Type</th>
                  {isAdmin && <th className="py-3.5 px-3.5">Complainant</th>}
                  <th className="py-3.5 px-3.5">Reported Date</th>
                  <th className="py-3.5 px-3.5">Loss (₹)</th>
                  <th className="py-3.5 px-3.5">Current Status</th>
                  {isAdmin ? (
                    <th className="py-3.5 px-3.5">Change Status</th>
                  ) : (
                    <th className="py-3.5 px-3.5">Police Remark</th>
                  )}
                  <th className="py-3.5 px-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs">
                {filteredCases.map((c) => {
                  const caseId = c.id || c.caseId;
                  const isUpdating = updatingId === caseId;

                  return (
                    <tr key={caseId} className="hover:bg-slate-800/40 transition-colors">
                      <td className={`py-4 px-3.5 font-mono font-bold ${isAdmin ? 'text-amber-400' : 'text-cyan-400'}`}>
                        {caseId}
                      </td>

                      <td className="py-4 px-3.5">
                        <p className="font-semibold text-slate-200">{c.title}</p>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">{c.caseType}</p>
                      </td>

                      {isAdmin && (
                        <td className="py-4 px-3.5 font-mono text-slate-300">
                          <div>{c.victimInfo?.name || c.userName || 'Citizen'}</div>
                          <div className="text-[10px] text-slate-500">{c.victimInfo?.phone || ''}</div>
                        </td>
                      )}

                      <td className="py-4 px-3.5 font-mono text-slate-400">{c.createdDate}</td>

                      <td className="py-4 px-3.5 font-mono text-rose-400 font-bold">
                        ₹{c.lossAmount ? Number(c.lossAmount).toLocaleString() : '0'}
                      </td>

                      <td className="py-4 px-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                          c.status === 'Resolved' || c.status === 'Closed'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : c.status === 'FIR Registered'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                            : c.status === 'In Progress' || c.status === 'Under Investigation'
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}>
                          {c.status || 'Submitted'}
                        </span>
                      </td>

                      {isAdmin ? (
                        <td className="py-4 px-3.5">
                          <select
                            disabled={isUpdating}
                            value={c.status || 'Submitted'}
                            onChange={(e) => handleStatusChange(caseId, e.target.value)}
                            className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-500 cursor-pointer disabled:opacity-50"
                          >
                            {filterTabs.filter(t => t !== 'All').map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          {isUpdating && <span className="ml-1.5 text-[10px] text-amber-400 font-mono">Saving...</span>}
                        </td>
                      ) : (
                        <td className="py-4 px-3.5 font-mono text-[11px] text-slate-400 max-w-xs truncate">
                          {c.officerNotes || 'Under initial review.'}
                        </td>
                      )}

                      <td className="py-4 px-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => navigate(`/cases/${caseId}`)}
                            className={`px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 font-mono text-xs transition-colors cursor-pointer ${
                              isAdmin ? 'text-amber-400' : 'text-cyan-400'
                            }`}
                          >
                            Details →
                          </button>

                          {isAdmin && (
                            <button
                              onClick={async () => {
                                if (window.confirm(`Are you sure you want to permanently delete case ${caseId}?`)) {
                                  if (removeCase) await removeCase(caseId);
                                }
                              }}
                              title="Delete Case"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No Complaints Found"
          description="No cyber complaints match the selected filter."
          actionText="File a New Complaint"
          onAction={() => navigate('/cases/new')}
        />
      )}
    </div>
  );
};

export default CasesPage;
