import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ShieldCheck,
  UserCheck,
  RefreshCw,
  TrendingUp,
  Activity,
  Layers,
  Cpu,
  BarChart2,
  Check,
} from 'lucide-react';
import { adminApi } from '../../services/api';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [metrics, setMetrics] = useState(null);

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
      console.warn('Failed to load admin telemetry:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatsAndMetrics();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-slate-800 bg-slate-900/60">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CrimeVision Application Management Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            System Administration Dashboard
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Monitor registered citizen user accounts, system analysis statistics, threat category distributions, and ML model evaluation metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin/users')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-colors"
          >
            Manage Users
          </button>
          <button
            onClick={fetchStatsAndMetrics}
            title="Refresh System Stats"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Admin Metric Cards (From Real MongoDB Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {/* Total Users */}
        <div className="p-4 rounded-xl glass-panel border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium">Total Users</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-slate-100 font-mono">{stats?.totalUsers ?? 0}</p>
          <span className="text-[10px] text-slate-400 font-mono">Registered accounts</span>
        </div>

        {/* Active Users */}
        <div className="p-4 rounded-xl glass-panel border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium">Active Users</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">{stats?.activeUsers ?? 0}</p>
          <span className="text-[10px] text-slate-400 font-mono">Enabled citizen logins</span>
        </div>

        {/* Total Analyses */}
        <div className="p-4 rounded-xl glass-panel border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium">Total Analyses</span>
            <Search className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-slate-100 font-mono">{stats?.totalAnalyses ?? 0}</p>
          <span className="text-[10px] text-slate-400 font-mono">Evidence scans run</span>
        </div>

        {/* Potential Fraud */}
        <div className="p-4 rounded-xl glass-panel border border-rose-500/30 bg-rose-950/10 space-y-1">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-[11px] font-medium">Fraud Detected</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-black text-rose-400 font-mono">{stats?.potentialFraudDetections ?? 0}</p>
          <span className="text-[10px] text-rose-400/70 font-mono">High/Critical threat rating</span>
        </div>

        {/* Low Risk */}
        <div className="p-4 rounded-xl glass-panel border border-emerald-500/30 bg-emerald-950/10 space-y-1">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[11px] font-medium">Low-Risk Scans</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">{stats?.lowRiskAnalyses ?? 0}</p>
          <span className="text-[10px] text-emerald-400/70 font-mono">No threat vector detected</span>
        </div>

        {/* Complaints Generated */}
        <div className="p-4 rounded-xl glass-panel border border-amber-500/30 bg-amber-950/10 space-y-1">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[11px] font-medium">Complaints Drafted</span>
            <FileText className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400 font-mono">{stats?.complaintsGenerated ?? 0}</p>
          <span className="text-[10px] text-amber-400/70 font-mono">PDF complaints created</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ML MODEL PERFORMANCE SECTION (CALCULATED FROM PROJECT EVALUATION DATA) */}
      {/* ========================================================================= */}
      {metrics && (
        <div className="p-6 rounded-2xl glass-panel border border-cyan-500/30 bg-slate-900/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>CrimeVision ML Model Performance & Evaluation Metrics</span>
              </h3>
              <p className="text-xs text-slate-400">
                Performance evaluated on the cybercrime training dataset ({metrics.datasetSize} samples across {metrics.classes?.length || 6} categories)
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
              ✔ Verified Test Accuracy: {metrics.testAccuracy}%
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-400 block uppercase">Test Accuracy</span>
              <span className="text-lg font-black text-cyan-400">{metrics.testAccuracy}%</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-400 block uppercase">Precision</span>
              <span className="text-lg font-black text-emerald-400">{metrics.precision}%</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-400 block uppercase">Recall</span>
              <span className="text-lg font-black text-indigo-400">{metrics.recall}%</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-400 block uppercase">F1 Score</span>
              <span className="text-lg font-black text-purple-400">{metrics.f1Score}%</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-400 block uppercase">Training Samples</span>
              <span className="text-lg font-black text-slate-200">{metrics.trainingSamples}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-400 block uppercase">Number of Classes</span>
              <span className="text-lg font-black text-amber-400">{metrics.classes?.length || 6}</span>
            </div>
          </div>

          {/* User Feedback Validation Metric */}
          {metrics.userFeedbackStats && metrics.userFeedbackStats.totalEvaluated > 0 && (
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Live Citizen Feedback: {metrics.userFeedbackStats.totalEvaluated} predictions evaluated ({metrics.userFeedbackStats.correctCount} confirmed accurate)
              </span>
              <span className="text-emerald-400 font-bold">
                {metrics.userFeedbackStats.userValidatedAccuracy}% Citizen Accuracy
              </span>
            </div>
          )}
        </div>
      )}

      {/* Aggregate Distribution Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fraud Categories Breakdown */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Fraud Category Distribution</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Database Aggregate</span>
          </div>

          <div className="space-y-3">
            {stats?.fraudCategories?.map((cat, idx) => {
              const count = cat.count || 0;
              const total = stats.totalAnalyses || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-300">{cat._id || 'General Cyber Threat'}</span>
                    <span className="font-mono text-slate-400 font-bold">{count} scans ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Threat Risk Distribution */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Threat Risk Level Distribution</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Severity Assessment</span>
          </div>

          <div className="space-y-3">
            {stats?.riskDistribution?.map((risk, idx) => {
              const count = risk.count || 0;
              const total = stats.totalAnalyses || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: risk.color }} />
                      {risk.name}
                    </span>
                    <span className="font-mono text-slate-400 font-bold">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 5)}%`, backgroundColor: risk.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent User Registrations & System Audit Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Registered Users */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Recent User Registrations</span>
            </h3>
            <button
              onClick={() => navigate('/admin/users')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              View All Users →
            </button>
          </div>

          <div className="space-y-2.5">
            {stats?.recentUsers?.map((u) => (
              <div
                key={u._id}
                className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold font-mono">
                    {u.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-200">{u.name}</p>
                    <p className="text-slate-400 text-[11px] font-mono">{u.email}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      u.isActive
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {u.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Audit Stream */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Recent System Activity</span>
            </h3>
            <button
              onClick={() => navigate('/admin/audit-logs')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              View Full Log →
            </button>
          </div>

          <div className="space-y-2.5">
            {stats?.recentActivity?.slice(0, 5).map((log) => (
              <div
                key={log._id}
                className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-amber-400 font-bold px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/30">
                    {log.action}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-300 line-clamp-1 font-mono text-[11px]">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
