import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  FileImage,
  FileText,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Calendar,
  ExternalLink,
  RefreshCw,
  Clock,
  ChevronDown,
  ChevronUp,
  Lock,
  CreditCard,
  Building,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { analysisApi, complaintsApi } from '../services/api';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [analyses, setAnalyses] = useState([]);
  const [drafts, setDrafts] = useState([]);

  // Redirect Admin to /admin dashboard automatically
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

  const [showFirstAidGuide, setShowFirstAidGuide] = useState(false);

  // Compute stats
  const totalAnalyses = analyses.length;
  const fraudDetected = analyses.filter(
    (a) => a.riskLevel === 'Critical' || a.riskLevel === 'High'
  ).length;
  const lowRiskAnalyses = analyses.filter((a) => a.riskLevel === 'Low').length;
  const complaintsGenerated = drafts.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Cybercrime Assistance Platform</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Welcome, <span className="text-cyan-400">{user?.name || 'Citizen'}</span>
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Upload suspicious WhatsApp chats, payment screenshots, emails, or PDFs. CrimeVision extracts forensic entities, runs ML fraud classification, and helps you generate formal police complaint drafts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/analyze')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-cyan-glow transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Analyze Evidence Now</span>
            </button>
            <button
              onClick={loadData}
              title="Refresh Data"
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Cybercrime Helpline & First-Aid Guide Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-rose-950/50 via-slate-900 to-slate-900 border border-rose-500/30 overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 flex-shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <span>National Cyber Crime Emergency Protocol (Helpline 1930)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Victim of financial fraud? Act during the <strong>Golden 2 Hours</strong> for maximum chance of bank debit freezing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href="tel:1930"
              className="px-4 py-2 rounded-xl bg-rose-500 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 hover:bg-rose-400 transition-colors shadow-lg"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call 1930</span>
            </a>
            <button
              onClick={() => setShowFirstAidGuide(!showFirstAidGuide)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <span>{showFirstAidGuide ? 'Hide Guide' : 'Golden Hour Protocol'}</span>
              {showFirstAidGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expandable Golden Hour Response Guide */}
        {showFirstAidGuide && (
          <div className="border-t border-rose-500/20 bg-slate-950/90 p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn text-xs">
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold">
                <Clock className="w-4 h-4" />
                <span className="font-mono uppercase tracking-wider">Step 1: Immediate Helpline</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Dial <strong>1930</strong> or register on <strong>cybercrime.gov.in</strong> immediately. State the transaction UTR number, your bank account, and suspect UPI handle to freeze the beneficiary account before cash withdrawal.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Lock className="w-4 h-4" />
                <span className="font-mono uppercase tracking-wider">Step 2: Freeze Payment Channels</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Immediately block compromised debit/credit cards and reset your NetBanking password & UPI MPIN. Call your bank's 24x7 fraud desk and request an immediate lien mark on disputed transactions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <FileText className="w-4 h-4" />
                <span className="font-mono uppercase tracking-wider">Step 3: Evidence Chain Custody</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Do not delete chat logs. Take uncropped screenshots showing sender phone numbers, timestamps, and payment receipts. Use CrimeVision to extract entities and generate an evidence-linked police complaint draft.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions Bar */}
      <div>
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <span>Quick Actions</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            onClick={() => navigate('/analyze', { state: { tab: 'image' } })}
            className="p-4 rounded-xl glass-panel border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all text-left group flex flex-col justify-between"
          >
            <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 w-fit group-hover:scale-110 transition-transform">
              <FileImage className="w-5 h-5" />
            </div>
            <div className="mt-3">
              <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">
                Analyze Screenshot
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">OCR scan for chats & QR</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/analyze', { state: { tab: 'pdf' } })}
            className="p-4 rounded-xl glass-panel border border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-left group flex flex-col justify-between"
          >
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 w-fit group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div className="mt-3">
              <p className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                Analyze PDF
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Bank statements & receipts</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/analyze', { state: { tab: 'text' } })}
            className="p-4 rounded-xl glass-panel border border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-left group flex flex-col justify-between"
          >
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 w-fit group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="mt-3">
              <p className="text-xs font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">
                Check Suspicious Text
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Paste SMS, email, or chat</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/my-analyses')}
            className="p-4 rounded-xl glass-panel border border-slate-800 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-left group flex flex-col justify-between"
          >
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 w-fit group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <div className="mt-3">
              <p className="text-xs font-bold text-slate-200 group-hover:text-purple-400 transition-colors">
                View My Analyses
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">History of scanned items</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/complaint-generator')}
            className="p-4 rounded-xl glass-panel border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-left group flex flex-col justify-between col-span-2 sm:col-span-1"
          >
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 w-fit group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div className="mt-3">
              <p className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                Generate Complaint
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Draft printable police PDF</p>
            </div>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Analyses */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Total Analyses</p>
            <p className="text-2xl font-extrabold text-slate-100 font-mono mt-0.5">
              {totalAnalyses}
            </p>
          </div>
        </div>

        {/* Potential Fraud Detected */}
        <div className="p-5 rounded-2xl glass-panel border border-rose-500/30 bg-rose-950/10 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Potential Fraud Detected</p>
            <p className="text-2xl font-extrabold text-rose-400 font-mono mt-0.5">
              {fraudDetected}
            </p>
          </div>
        </div>

        {/* Low-Risk Analyses */}
        <div className="p-5 rounded-2xl glass-panel border border-emerald-500/30 bg-emerald-950/10 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Low-Risk Analyses</p>
            <p className="text-2xl font-extrabold text-emerald-400 font-mono mt-0.5">
              {lowRiskAnalyses}
            </p>
          </div>
        </div>

        {/* Complaints Generated */}
        <div className="p-5 rounded-2xl glass-panel border border-amber-500/30 bg-amber-950/10 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Complaints Generated</p>
            <p className="text-2xl font-extrabold text-amber-400 font-mono mt-0.5">
              {complaintsGenerated}
            </p>
          </div>
        </div>
      </div>

      {/* Cybercrime Helpline Emergency Info Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 flex-shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              National Cyber Crime Reporting Portal & Helpline
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Victim of financial fraud? Call the government toll-free cyber helpline within golden hours (first 24 hours) for maximum chance of bank freeze.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href="tel:1930"
            className="px-4 py-2 rounded-xl bg-rose-500 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 hover:bg-rose-400 transition-colors shadow-lg"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call 1930</span>
          </a>
          <button
            onClick={() => navigate('/nearby-police')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
          >
            Find Police Station
          </button>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-100">Recent Evidence Analyses</h2>
            <p className="text-xs text-slate-400">Your latest digital evidence scans and ML threat classifications</p>
          </div>
          <button
            onClick={() => navigate('/my-analyses')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            <span>View All Analyses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {analyses.length === 0 ? (
          <div className="p-8 rounded-2xl glass-panel border border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-300">No analyses recorded yet</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Scan a screenshot, transaction receipt, or paste suspicious text to run AI fraud detection.
            </p>
            <button
              onClick={() => navigate('/analyze')}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-cyan-glow"
            >
              Start First Scan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyses.slice(0, 6).map((item) => {
              const isHighRisk = item.riskLevel === 'Critical' || item.riskLevel === 'High';
              return (
                <div
                  key={item._id || item.analysisId}
                  className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono text-slate-400 font-bold">
                        {item.analysisId}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                          isHighRisk
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                            : item.riskLevel === 'Medium'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {item.riskLevel.toUpperCase()} RISK ({item.riskScore}%)
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-200 line-clamp-1">
                      {item.predictedCategory}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.extractedText}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>

                    <div className="flex items-center gap-2">
                      {item.complaintDraftGenerated ? (
                        <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                          Draft Created
                        </span>
                      ) : (
                        <button
                          onClick={() => navigate('/complaint-generator', { state: { analysis: item } })}
                          className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
                        >
                          Draft Complaint →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
