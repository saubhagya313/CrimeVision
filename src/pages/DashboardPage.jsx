import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderLock,
  Activity,
  FileSearch,
  AlertTriangle,
  ShieldAlert,
  Plus,
  Upload,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import StatCard from '../components/common/StatCard';
import RiskBadge from '../components/common/RiskBadge';
import EvidenceCard from '../components/evidence/EvidenceCard';
import { useCase } from '../context/CaseContext';
import { useAuth } from '../context/AuthContext';

// Chart Mock Data
const fraudTrendData = [
  { month: 'Jan', suspicious: 12, resolved: 8 },
  { month: 'Feb', suspicious: 18, resolved: 14 },
  { month: 'Mar', suspicious: 25, resolved: 19 },
  { month: 'Apr', suspicious: 22, resolved: 20 },
  { month: 'May', suspicious: 31, resolved: 24 },
  { month: 'Jun', suspicious: 37, resolved: 28 },
];

const typeDistributionData = [
  { name: 'Images', value: 45, color: '#06b6d4' },
  { name: 'Chats', value: 38, color: '#3b82f6' },
  { name: 'PDFs', value: 28, color: '#8b5cf6' },
  { name: 'Emails', value: 22, color: '#f59e0b' },
  { name: 'Receipts', value: 15, color: '#10b981' },
  { name: 'Other', value: 8, color: '#64748b' },
];

const riskDistributionData = [
  { name: 'Low', count: 6, fill: '#10b981' },
  { name: 'Medium', count: 8, fill: '#f59e0b' },
  { name: 'High', count: 6, fill: '#f97316' },
  { name: 'Critical', count: 4, fill: '#f43f5e' },
];

const DashboardPage = () => {
  const { user } = useAuth();
  const { cases, evidenceList, stats } = useCase();
  const navigate = useNavigate();

  const recentCases = cases.slice(0, 4);
  const recentEvidence = evidenceList.slice(0, 4);

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs">
            <Activity className="w-3.5 h-3.5" />
            <span>CITIZEN CYBER COMPLAINT PORTAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Welcome, <span className="cyber-gradient-text">{user?.name || 'User'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Submit cyber fraud complaints, track investigation progress, and attach transaction evidence.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => navigate('/cases/new')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider shadow-cyan-glow transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Report Cyber Crime</span>
          </button>

          <button
            onClick={() => navigate('/evidence/upload')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Attach Evidence</span>
          </button>
        </div>
      </div>

      {/* 5 Key Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Cases"
          value={stats?.totalCases || 24}
          change={stats?.trends?.totalCases || '+12.5%'}
          icon={FolderLock}
          color="cyan"
        />
        <StatCard
          title="Active Investigations"
          value={stats?.activeInvestigations || 8}
          change={stats?.trends?.activeInvestigations || '+4.2%'}
          icon={Activity}
          color="blue"
        />
        <StatCard
          title="Evidence Files"
          value={stats?.evidenceFiles || 156}
          change={stats?.trends?.evidenceFiles || '+18.7%'}
          icon={FileSearch}
          color="purple"
        />
        <StatCard
          title="Suspicious Evidence"
          value={stats?.suspiciousEvidence || 37}
          change={stats?.trends?.suspiciousEvidence || '+9.1%'}
          icon={AlertTriangle}
          color="amber"
        />
        <StatCard
          title="High-Risk Cases"
          value={stats?.highRiskCases || 6}
          change={stats?.trends?.highRiskCases || '+2.0%'}
          icon={ShieldAlert}
          color="rose"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fraud Detection Overview Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
                Fraud Detection & Evidence Trends
              </h3>
              <p className="text-xs text-slate-400">Suspicious evidence detected vs resolved over time</p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
              JAN - JUN 2026
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fraudTrendData}>
                <defs>
                  <linearGradient id="colorSuspicious" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" />
                <YAxis stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="suspicious" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorSuspicious)" name="Suspicious Detected" />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" name="Analyzed / Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Evidence Type Distribution Donut Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
              Evidence Types
            </h3>
            <span className="text-xs font-mono text-slate-400">156 Files</span>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {typeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {typeDistributionData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}: <strong className="text-slate-200">{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Investigations Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
              Recent Case Investigations
            </h3>
            <p className="text-xs text-slate-400">Active and recently updated digital forensics cases</p>
          </div>
          <button
            onClick={() => navigate('/cases')}
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
          >
            View All Cases ({cases.length}) <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Case Title</th>
                <th className="py-3 px-4">Evidence</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {recentCases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{c.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">
                    <div>{c.title}</div>
                    <div className="text-[10px] font-mono text-slate-500">{c.caseType} • Victim: {c.victimInfo.name}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{c.evidenceCount} Files</td>
                  <td className="py-3.5 px-4">
                    <RiskBadge level={c.riskLevel} />
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700 text-[10px]">
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">{c.lastUpdated}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => navigate(`/cases/${c.id}`)}
                      className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono text-xs transition-colors"
                    >
                      Inspect Case
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Uploaded Evidence Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
            Recently Ingested Evidence
          </h3>
          <button
            onClick={() => navigate('/evidence')}
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
          >
            Browse Evidence Directory <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentEvidence.map((ev) => (
            <EvidenceCard key={ev.id} evidence={ev} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
