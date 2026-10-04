import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  DollarSign,
  Calendar,
  Building,
  RefreshCw,
  Layers,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { complaintsApi } from '../../services/api';

const AdminComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await complaintsApi.getAdminComplaints();
      setComplaints(res?.data || []);
    } catch (err) {
      console.warn('Failed to load complaints:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalLoss = complaints.reduce(
    (acc, curr) => acc + (curr.incidentInfo?.financialLoss || 0),
    0
  );

  const filtered = complaints.filter(
    (c) =>
      !searchQuery ||
      c.draftId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.incidentInfo?.incidentType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.policeStation?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Citizen Complaint Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Complaint Monitoring
          </h1>
          <p className="text-xs text-slate-400">
            Overview of generated citizen police complaint drafts, fraud categories, and jurisdictional assignment.
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

      {/* Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl glass-panel border border-slate-800 space-y-1">
          <span className="text-[11px] font-medium text-slate-400">Total Drafts Generated</span>
          <p className="text-2xl font-black text-amber-400 font-mono">{complaints.length}</p>
        </div>
        <div className="p-4 rounded-xl glass-panel border border-slate-800 space-y-1">
          <span className="text-[11px] font-medium text-slate-400">Aggregated Financial Loss</span>
          <p className="text-2xl font-black text-rose-400 font-mono">₹{totalLoss.toLocaleString('en-IN')}</p>
        </div>
        <div className="p-4 rounded-xl glass-panel border border-slate-800 space-y-1">
          <span className="text-[11px] font-medium text-slate-400">Platform Status</span>
          <p className="text-2xl font-black text-emerald-400 font-mono">ONLINE (100%)</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Draft ID, fraud type, user, or police station..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs font-mono focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 border-b border-slate-800 font-mono text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Draft ID</th>
                <th className="py-3.5 px-4">Citizen User</th>
                <th className="py-3.5 px-4">Fraud Incident Type</th>
                <th className="py-3.5 px-4">Loss Amount</th>
                <th className="py-3.5 px-4">Police Station Assigned</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date Drafted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-sans">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No complaint records found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item._id || item.draftId} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                      {item.draftId}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-200">
                      {item.userName || 'Citizen'}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-300">
                      {item.incidentInfo?.incidentType}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-rose-400">
                      ₹{item.incidentInfo?.financialLoss || 0}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 max-w-[200px] truncate">
                      {item.policeStation?.name || 'Local Cyber Police'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {item.status || 'DRAFT'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminComplaintsPage;
