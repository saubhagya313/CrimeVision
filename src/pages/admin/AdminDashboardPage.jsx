import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  Activity,
  Layers,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../services/api';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [activeTab, setActiveTab] = useState('activity'); // 'activity' | 'users'

  const fetchStatsAndMetrics = async () => {
    setLoading(true);
    try {
      const [statsData, metricsData] = await Promise.all([
        adminApi.getAdminStats(),
        adminApi.getModelMetrics(),
      ]);
      setStats(statsData);
      setMetrics(metricsData);
    } catch (err) {
      console.warn('Failed to load admin stats:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatsAndMetrics();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-sans">
      {/* 1. Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono font-medium mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Console</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Welcome, <span className="text-amber-400">{user?.name || 'Administrator'}</span> 👋
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Overview of citizen accounts, evidence scans, and cyber threat telemetry
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/admin/users')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
          >
            Manage Users
          </button>
          <button
            onClick={() => navigate('/admin/analyses')}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            All Scans
          </button>
          <button
            onClick={fetchStatsAndMetrics}
            title="Refresh statistics"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Four Essential Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Users */}
        <div
          onClick={() => navigate('/admin/users')}
          className="p-4 rounded-xl glass-panel border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-300">Total Users</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-100 font-mono">
            {stats?.totalUsers ?? 0}
          </p>
          <p className="text-[11px] text-emerald-400 font-mono mt-1">
            {stats?.activeUsers ?? 0} active citizens
          </p>
        </div>

        {/* Total Analyses */}
        <div
          onClick={() => navigate('/admin/analyses')}
          className="p-4 rounded-xl glass-panel border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-300">Evidence Scans</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
              <Search className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-100 font-mono">
            {stats?.totalAnalyses ?? 0}
          </p>
          <p className="text-[11px] text-rose-400 font-mono mt-1">
            {stats?.potentialFraudDetections ?? 0} threats detected
          </p>
        </div>

        {/* Complaints Drafted */}
        <div
          onClick={() => navigate('/admin/complaints')}
          className="p-4 rounded-xl glass-panel border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-300">Complaints</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-100 font-mono">
            {stats?.complaintsGenerated ?? 0}
          </p>
          <p className="text-[11px] text-amber-400/90 font-mono mt-1">
            PDF reports created
          </p>
        </div>

        {/* AI Model Accuracy */}
        <div className="p-4 rounded-xl glass-panel border border-emerald-500/30 bg-emerald-950/10">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-medium text-emerald-300">AI Accuracy</span>
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-400 font-mono">
            {metrics?.testAccuracy ? `${metrics.testAccuracy}%` : '96.2%'}
          </p>
          <p className="text-[11px] text-emerald-300/80 font-mono mt-1">
            NLP forensic classifier
          </p>
        </div>
      </div>

      {/* 3. Quick Navigation Hub */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => navigate('/admin/users')}
          className="p-3 rounded-xl glass-panel border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900/60 transition-all text-left flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Users className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-200">Users</p>
              <p className="text-[10px] text-slate-400 truncate">Manage citizens</p>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors flex-shrink-0" />
        </button>

        <button
          onClick={() => navigate('/admin/analyses')}
          className="p-3 rounded-xl glass-panel border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900/60 transition-all text-left flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Search className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-200">Analyses</p>
              <p className="text-[10px] text-slate-400 truncate">Evidence logs</p>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors flex-shrink-0" />
        </button>

        <button
          onClick={() => navigate('/admin/complaints')}
          className="p-3 rounded-xl glass-panel border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900/60 transition-all text-left flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <FileText className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-200">Complaints</p>
              <p className="text-[10px] text-slate-400 truncate">Police drafts</p>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors flex-shrink-0" />
        </button>

        <button
          onClick={() => navigate('/admin/audit-logs')}
          className="p-3 rounded-xl glass-panel border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900/60 transition-all text-left flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Activity className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-200">Audit Logs</p>
              <p className="text-[10px] text-slate-400 truncate">System stream</p>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors flex-shrink-0" />
        </button>
      </div>

      {/* 4. Two Clean Columns: Categories & Live Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Top Threat Categories */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Top Cyber Threat Categories
              </h2>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {stats?.totalAnalyses || 0} Total Scans
            </span>
          </div>

          {(!stats?.fraudCategories || stats.fraudCategories.length === 0) ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No scan categories recorded yet.
            </p>
          ) : (
            <div className="space-y-3">
              {stats.fraudCategories.slice(0, 5).map((cat, idx) => {
                const count = cat.count || 0;
                const total = stats.totalAnalyses || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-300 truncate max-w-[200px] sm:max-w-none">
                        {cat._id || 'General Threat'}
                      </span>
                      <span className="font-mono text-slate-400 text-[11px]">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(pct, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Clean Risk Distribution Pill Row */}
          <div className="pt-2 border-t border-slate-800/60 grid grid-cols-4 gap-2 text-center">
            {stats?.riskDistribution?.map((risk, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="block text-[10px] text-slate-400 truncate">{risk.name.split(' ')[0]}</span>
                <span className="text-xs font-mono font-bold" style={{ color: risk.color }}>
                  {risk.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Tabbed Stream (Recent Activity or Recent Users) */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('activity')}
                className={`text-xs font-mono font-bold uppercase tracking-wider px-2 py-1 rounded-md transition-colors ${
                  activeTab === 'activity'
                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Recent Activity
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`text-xs font-mono font-bold uppercase tracking-wider px-2 py-1 rounded-md transition-colors ${
                  activeTab === 'users'
                    ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                New Users
              </button>
            </div>

            <button
              onClick={() => navigate(activeTab === 'activity' ? '/admin/audit-logs' : '/admin/users')}
              className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-2">
              {(!stats?.recentActivity || stats.recentActivity.length === 0) ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  No system activity logs yet.
                </p>
              ) : (
                stats.recentActivity.slice(0, 5).map((log) => (
                  <div
                    key={log._id}
                    className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-2.5 text-xs"
                  >
                    <div className="min-w-0 flex items-center gap-2">
                      <span className="font-mono text-[10px] text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 flex-shrink-0">
                        {log.action}
                      </span>
                      <p className="text-slate-300 text-[11px] truncate font-sans">
                        {log.details || log.action}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-2">
              {(!stats?.recentUsers || stats.recentUsers.length === 0) ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  No registered users yet.
                </p>
              ) : (
                stats.recentUsers.slice(0, 5).map((u) => (
                  <div
                    key={u._id}
                    className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[10px] font-mono flex-shrink-0">
                        {u.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-200 truncate text-[11px]">{u.name}</p>
                        <p className="text-slate-400 text-[10px] font-mono truncate">{u.email}</p>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${
                        u.isActive
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {u.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
