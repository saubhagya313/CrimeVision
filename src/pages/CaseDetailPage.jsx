import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Shield,
  Upload,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Trash2,
  Download,
  Mail,
} from 'lucide-react';
import EvidenceCard from '../components/evidence/EvidenceCard';
import EmptyState from '../components/common/EmptyState';
import CaseClosureModal from '../components/common/CaseClosureModal';
import { casesApi, evidenceApi } from '../services/api';
import { useCase } from '../context/CaseContext';
import { useAuth } from '../context/AuthContext';

const statusSteps = ['Submitted', 'Under Review', 'In Progress', 'FIR Registered', 'Resolved'];

const CaseDetailPage = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { evidenceList, refreshCases, showToast, removeCase } = useCase();

  const isAdmin = user?.role === 'Admin' || user?.role === 'Investigator';

  const [currentCase, setCurrentCase] = useState(null);
  const [caseEvidence, setCaseEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showClosureModal, setShowClosureModal] = useState(false);

  // Admin form fields
  const [editStatus, setEditStatus] = useState('Submitted');
  const [officerNotes, setOfficerNotes] = useState('');
  const [savingUpdates, setSavingUpdates] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const c = await casesApi.getCaseById(caseId || 'CV-2026-001');
        setCurrentCase(c);
        setEditStatus(c.status || 'Submitted');
        setOfficerNotes(c.officerNotes || '');
        const ev = await evidenceApi.getEvidence({ caseId: c.id || c.caseId });
        setCaseEvidence(ev);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [caseId, evidenceList]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!currentCase) return;
    setSavingUpdates(true);
    try {
      const updated = await casesApi.updateCase(currentCase.id || currentCase.caseId, {
        status: editStatus,
        officerNotes,
        officerName: user?.name || 'Investigating Officer',
      });
      setCurrentCase({
        ...currentCase,
        ...updated,
        status: editStatus,
        officerNotes,
      });
      await refreshCases();

      if (editStatus === 'Resolved' || editStatus === 'Closed') {
        await casesApi.sendResolutionEmail(currentCase.id || currentCase.caseId).catch(() => {});
        if (showToast) {
          showToast(
            `Case resolved! Formal closure certificate & PDF report emailed to citizen registered address & email.`,
            'success'
          );
        }
      } else {
        if (showToast) showToast(`Case status updated to "${editStatus}"!`, 'success');
      }
    } catch (err) {
      console.error('Failed to update case', err);
      if (showToast) showToast('Failed to update case.', 'error');
    } finally {
      setSavingUpdates(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !currentCase) {
    return (
      <div className="p-12 text-center font-mono text-cyan-400 animate-pulse">
        Loading Case #{caseId}...
      </div>
    );
  }

  const currentStepIndex = statusSteps.indexOf(currentCase.status) !== -1
    ? statusSteps.indexOf(currentCase.status)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Back Button */}
      <button
        onClick={() => navigate('/cases')}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Complaints List
      </button>

      {/* Case Header Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-500/40">
                {currentCase.id || currentCase.caseId}
              </span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${
                currentCase.status === 'Resolved' || currentCase.status === 'Closed'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : currentCase.status === 'FIR Registered'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : currentCase.status === 'In Progress' || currentCase.status === 'Under Investigation'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                Current Status: {currentCase.status || 'Submitted'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100">{currentCase.title}</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Category: <strong className="text-slate-200">{currentCase.caseType}</strong> • Reported on: {currentCase.createdDate}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Case Closure PDF Button (Available to both User and Admin) */}
            {(currentCase.status === 'Resolved' || currentCase.status === 'Closed') ? (
              <button
                onClick={() => setShowClosureModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-lg animate-pulse"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Download Closure Report (PDF)</span>
              </button>
            ) : (
              <button
                onClick={() => setShowClosureModal(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>View Summary / PDF</span>
              </button>
            )}

            {!isAdmin && (
              <button
                onClick={handlePrint}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-cyan-400" />
                <span>Print Receipt</span>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={async () => {
                  if (window.confirm(`Are you sure you want to permanently delete case ${currentCase.id || currentCase.caseId}?`)) {
                    if (removeCase) await removeCase(currentCase.id || currentCase.caseId);
                    navigate('/cases');
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-slate-950 border border-rose-500/40 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            )}

            <button
              onClick={() => navigate('/evidence/upload')}
              className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Attach Evidence</span>
            </button>
          </div>
        </div>

        {/* Visual 5-Step Status Tracker */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
            Status Progression
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {statusSteps.map((step, idx) => {
              const isPastOrCurrent = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div
                  key={step}
                  className={`p-2.5 rounded-xl border text-center font-mono text-xs transition-all ${
                    isCurrent
                      ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 font-bold shadow-md'
                      : isPastOrCurrent
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    {isPastOrCurrent ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-700 text-[9px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] block">{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Admin Status Changer Control Panel (Only visible to Admin) */}
      {isAdmin && (
        <form onSubmit={handleStatusUpdate} className="p-5 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-slate-100 uppercase font-mono">
                Officer Status & Remarks Updater
              </h2>
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
              POLICE ACCESS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1.5 font-bold">
                Change Complaint Status:
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 font-mono text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {statusSteps.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1.5 font-bold">
                Logged Officer:
              </label>
              <input
                type="text"
                disabled
                value={`${user?.name || 'Officer'} (${user?.badgeNumber || 'CYB-709'})`}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-400 font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1.5 font-bold">
              Official Police Remarks (Citizen can view this directly on their screen):
            </label>
            <textarea
              rows={2}
              value={officerNotes}
              onChange={(e) => setOfficerNotes(e.target.value)}
              placeholder="e.g., Notice issued to bank nodal officer to freeze suspect UPI ID. Cyber cell is investigating IP logs."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 font-mono text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingUpdates}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{savingUpdates ? 'Saving...' : 'Save & Notify Citizen'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Case Details & Citizen View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Description & Official Remarks */}
        <div className="md:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-slate-100 uppercase font-mono border-b border-slate-800 pb-2">
            Complaint Description
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
            {currentCase.description}
          </p>

          {/* Official Police Notes Box (Displayed Prominently for Citizen) */}
          <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 space-y-1">
            <span className="text-cyan-400 font-bold font-mono text-xs flex items-center gap-1.5">
              👮 Official Police / Cyber Cell Update:
            </span>
            <p className="text-xs text-slate-200 font-mono">
              {currentCase.officerNotes || 'Your complaint is currently under preliminary verification by the cyber forensics desk.'}
            </p>
          </div>
        </div>

        {/* Complainant Info Summary */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs">
          <h2 className="text-sm font-bold text-slate-100 uppercase border-b border-slate-800 pb-2">
            Complainant Details
          </h2>
          <div className="space-y-2">
            <div>
              <span className="text-slate-500 text-[10px] block">VICTIM NAME</span>
              <p className="text-slate-200 font-bold">{currentCase.victimInfo?.name || currentCase.userName || 'Citizen User'}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">PHONE NUMBER</span>
              <p className="text-slate-200">{currentCase.victimInfo?.phone || 'N/A'}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">EMAIL</span>
              <p className="text-slate-200">{currentCase.victimInfo?.email || 'N/A'}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">BANK NAME</span>
              <p className="text-slate-200">{currentCase.victimInfo?.bankName || 'N/A'}</p>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <span className="text-slate-500 text-[10px] block">FINANCIAL LOSS</span>
              <p className="text-rose-400 font-bold text-sm">
                ₹{currentCase.lossAmount ? Number(currentCase.lossAmount).toLocaleString() : '0'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Files List */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-slate-100 uppercase font-mono">
            Attached Digital Evidence ({caseEvidence.length})
          </h2>
          <button
            onClick={() => navigate('/evidence/upload')}
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
          >
            + Upload More Evidence
          </button>
        </div>

        {caseEvidence.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {caseEvidence.map((ev) => (
              <EvidenceCard key={ev.id || ev._id} evidence={ev} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Evidence Attached Yet"
            description="Upload screenshots of payments, WhatsApp chats, or SMS messages to support this complaint."
            actionText="Upload Evidence File"
            onAction={() => navigate('/evidence/upload')}
          />
        )}
      </div>

      {/* Official Case Closure Report & Certificate Modal */}
      <CaseClosureModal
        isOpen={showClosureModal}
        onClose={() => setShowClosureModal(false)}
        caseData={currentCase}
      />
    </div>
  );
};

export default CaseDetailPage;
