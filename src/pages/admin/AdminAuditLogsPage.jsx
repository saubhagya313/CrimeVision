import React, { useState, useEffect } from 'react';
import {
  ScrollText,
  Search,
  Filter,
  RefreshCw,
  Calendar,
  Shield,
  Clock,
  User,
} from 'lucide-react';
import { adminApi } from '../../services/api';

const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('All');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (actionFilter !== 'All') params.action = actionFilter;
      if (searchQuery) params.search = searchQuery;

      const data = await adminApi.getAuditLogs(params);
      setLogs(data || []);
    } catch (err) {
      console.warn('Failed to load audit logs:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [actionFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadLogs();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono font-medium mb-1 border border-slate-700">
            <ScrollText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Immutable Compliance & Security Audit Logs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            System Audit Logs
          </h1>
          <p className="text-xs text-slate-400">
            Chronological audit trail of user registrations, logins, threat analyses, account modifications, and complaint generations.
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-2 text-xs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit details, user name, or IP address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs font-mono focus:outline-none focus:border-cyan-500"
          />
        </form>

        <div className="flex items-center gap-1.5 text-xs font-mono overflow-x-auto pb-1">
          <span className="text-slate-400 text-[11px] mr-1 flex-shrink-0">Action:</span>
          {[
            'All',
            'USER_LOGIN',
            'USER_REGISTER',
            'AI_ANALYSIS_EXECUTED',
            'COMPLAINT_DRAFT_CREATED',
            'USER_ACTIVATED',
            'USER_DEACTIVATED',
          ].map((act) => (
            <button
              key={act}
              onClick={() => setActionFilter(act)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                actionFilter === act
                  ? 'bg-cyan-500 text-slate-950 shadow-cyan-glow font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {act === 'All' ? 'All Actions' : act.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 border-b border-slate-800 font-mono text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Action Type</th>
                <th className="py-3.5 px-4">Performed By</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-sans">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No audit records found matching criteria.
                  </td>
                </tr>
              ) : (
                logs.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}{' '}
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                        {item.action}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-200 whitespace-nowrap">
                      {item.userName || 'System'}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                      {item.ipAddress || '127.0.0.1'}
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px] leading-relaxed">
                      {item.details}
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

export default AdminAuditLogsPage;
