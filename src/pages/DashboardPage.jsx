import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  PhoneCall,
  RefreshCw,
  Mail,
  ChevronLeft,
  ChevronRight,
  Shield,
  CreditCard,
  Briefcase,
  Package,
  Clock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { analysisApi, complaintsApi } from '../services/api';

// Concise, high-priority Cybercrime Awareness Advisories
const AWARENESS_TIPS = [
  {
    tag: 'DIGITAL ARREST',
    title: 'Police & CBI Never Conduct "Digital Arrests"',
    tip: 'Law enforcement agencies never arrest citizens or demand funds over WhatsApp or Skype video calls. Hang up immediately and dial 1930.',
    icon: ShieldAlert,
    color: 'from-rose-500/20 to-rose-950/20 border-rose-500/30 text-rose-400',
  },
  {
    tag: 'UPI FRAUD',
    title: 'Entering UPI PIN Always Debits Money',
    tip: 'You NEVER need to enter your UPI PIN or scan a QR code to receive cashback or payments. If asked for a PIN to receive funds, it is fraud.',
    icon: CreditCard,
    color: 'from-amber-500/20 to-amber-950/20 border-amber-500/30 text-amber-400',
  },
  {
    tag: 'UTILITY SCAM',
    title: 'Beware of Fake Electricity Disconnection SMS',
    tip: 'Electricity boards never send disconnection threats from personal 10-digit mobile numbers or ask you to install APK apps.',
    icon: AlertTriangle,
    color: 'from-yellow-500/20 to-yellow-950/20 border-yellow-500/30 text-yellow-400',
  },
  {
    tag: 'JOB TRAP',
    title: 'Telegram / YouTube Likes Part-Time Job Trap',
    tip: 'Offers to like videos or rate hotels for ₹3,000/day lead to prepaid task deposit traps. Legitimate jobs never ask for advance money.',
    icon: Briefcase,
    color: 'from-purple-500/20 to-purple-950/20 border-purple-500/30 text-purple-400',
  },
  {
    tag: 'COURIER SCAM',
    title: 'Fake FedEx / Customs Narcotics Calls',
    tip: 'Customs and courier companies never demand cash transfers into private bank accounts for seized parcels.',
    icon: Package,
    color: 'from-blue-500/20 to-blue-950/20 border-blue-500/30 text-blue-400',
  },
  {
    tag: 'EMERGENCY PROTOCOL',
    title: 'Act Within the Golden 2 Hours of Fraud',
    tip: 'If an unauthorized transaction occurs, call helpline 1930 immediately with UTR details to freeze recipient accounts before withdrawal.',
    icon: Clock,
    color: 'from-emerald-500/20 to-emerald-950/20 border-emerald-500/30 text-emerald-400',
  },
];

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [analyses, setAnalyses] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [tipIndex, setTipIndex] = useState(0);

  // Auto-rotate awareness tips every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % AWARENESS_TIPS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Redirect Admin to /admin
  useEffect(() => {
    if (user?.role === 'Admin') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

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
      console.warn('Dashboard load warning:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalAnalyses = analyses.length;
  const fraudDetected = analyses.filter(
    (a) => a.riskLevel === 'Critical' || a.riskLevel === 'High'
  ).length;
  const complaintsGenerated = drafts.length;

  const currentTip = AWARENESS_TIPS[tipIndex];
  const TipIcon = currentTip.icon;

  return (
    <div className="space-y-5 max-w-6xl mx-auto pb-12 font-sans">
      {/* 1. Minimal Header Greeting & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Hello, <span className="text-cyan-400">{user?.name || 'Citizen'}</span> 👋
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
            <span>AI Cybercrime Detection & Police Complaint Assistant</span>
            {user?.email && (
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400/90 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                <Mail className="w-3 h-3" />
                <span>PDF Delivery: {user.email}</span>
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/analyze')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-cyan-glow flex items-center gap-2 transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Scan Evidence</span>
          </button>
          <button
            onClick={() => navigate('/complaint-generator')}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Draft Complaint</span>
          </button>
          <button
            onClick={loadData}
            title="Refresh"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Sleek Cyber Awareness Alert Card (Requested Feature, Minimal & Clean) */}
      <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-r ${currentTip.color} border transition-all duration-300 shadow-lg relative overflow-hidden`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex-shrink-0">
              <TipIcon className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950/80 border border-slate-700">
                  {currentTip.tag}
                </span>
                <span className="text-xs font-bold text-slate-100">
                  {currentTip.title}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                {currentTip.tip}
              </p>
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center gap-1.5 self-end sm:self-center flex-shrink-0">
            <button
              onClick={() =>
                setTipIndex((prev) => (prev - 1 + AWARENESS_TIPS.length) % AWARENESS_TIPS.length)
              }
              className="p-1.5 rounded-lg bg-slate-950/70 hover:bg-slate-900 text-slate-300 transition-colors"
              title="Previous Alert"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono text-slate-400 px-1">
              {tipIndex + 1}/{AWARENESS_TIPS.length}
            </span>
            <button
              onClick={() => setTipIndex((prev) => (prev + 1) % AWARENESS_TIPS.length)}
              className="p-1.5 rounded-lg bg-slate-950/70 hover:bg-slate-900 text-slate-300 transition-colors"
              title="Next Alert"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Compact Stats & Admin Desk Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl glass-panel border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Scans Completed</p>
            <p className="text-lg font-bold text-slate-100 font-mono">{totalAnalyses}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl glass-panel border border-rose-500/30 bg-rose-950/10 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-rose-500/20 text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Threats Flagged</p>
            <p className="text-lg font-bold text-rose-400 font-mono">{fraudDetected}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl glass-panel border border-emerald-500/30 bg-emerald-950/10 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Draft Complaints</p>
            <p className="text-lg font-bold text-emerald-400 font-mono">{complaintsGenerated}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl glass-panel border border-amber-500/30 bg-amber-950/10 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] text-amber-400 font-mono uppercase tracking-wider font-bold">
              Admin Support Desk
            </p>
            <p className="text-[11px] text-slate-300 font-mono truncate" title="ajitkumarsethi34@gmail.com">
              ajitkumarsethi34@gmail.com
            </p>
          </div>
          <a
            href="mailto:ajitkumarsethi34@gmail.com"
            className="p-2 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition-colors flex-shrink-0"
            title="Email Admin"
          >
            <Mail className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 4. Recent Scans (Clean, Minimal List) */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Recent Evidence Scans
          </h2>
          <button
            onClick={() => navigate('/my-analyses')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {analyses.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 space-y-2">
            <p>No evidence scanned yet.</p>
            <button
              onClick={() => navigate('/analyze')}
              className="text-cyan-400 hover:underline font-mono text-xs font-bold"
            >
              + Scan your first chat or screenshot
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {analyses.slice(0, 4).map((item) => {
              const isHigh = item.riskLevel === 'Critical' || item.riskLevel === 'High';
              return (
                <div
                  key={item._id || item.analysisId}
                  className="py-2.5 flex items-center justify-between gap-3 text-xs hover:bg-slate-900/40 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-[10px] text-slate-400 flex-shrink-0">
                      {item.analysisId}
                    </span>
                    <span className="font-medium text-slate-200 truncate">
                      {item.predictedCategory}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        isHigh
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {item.riskScore}% Risk
                    </span>
                    <button
                      onClick={() => navigate('/complaint-generator', { state: { analysis: item } })}
                      className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 font-semibold"
                    >
                      Draft →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Minimal Helpline Footer */}
      <div className="p-3 px-4 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
          <span>National Cyber Emergency Helpline: <strong className="text-slate-200 font-mono">1930</strong> (Toll-Free, Govt. of India)</span>
        </div>
        <div className="font-mono text-[10px] text-slate-400">
          Official Portal: <span className="text-cyan-400">cybercrime.gov.in</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
