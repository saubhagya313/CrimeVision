import React from 'react';
import { Shield, Printer, X, CheckCircle, Download, FileText } from 'lucide-react';

const CaseClosureModal = ({ isOpen, onClose, caseData }) => {
  if (!isOpen || !caseData) return null;

  const handlePrint = () => {
    window.print();
  };

  const caseId = caseData.id || caseData.caseId || 'CV-2026-001';
  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Top Control Bar (Hidden in Print) */}
        <div className="p-4 px-6 border-b border-slate-800 bg-slate-950 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-slate-100 font-mono">
              Official Case Closure Report & Certificate
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Document Body */}
        <div className="p-8 sm:p-10 bg-slate-950 text-slate-100 space-y-6 overflow-y-auto print:p-0 print:bg-white print:text-black font-sans">
          {/* Document Official Header */}
          <div className="text-center border-b-2 border-emerald-500/40 pb-6 print:border-black space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 print:border-black print:text-black">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-lg sm:text-xl font-black uppercase tracking-wider font-mono text-slate-100 print:text-black">
              STATE CYBER CRIME INVESTIGATION DIVISION
            </h1>
            <p className="text-xs font-mono text-slate-400 print:text-gray-700">
              National Cybercrime Reporting & Digital Forensics Redressal Cell
            </p>
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono text-xs font-bold print:border-black print:text-black">
              OFFICIAL CASE RESOLUTION & CLOSURE CERTIFICATE
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono print:bg-gray-100 print:border-gray-300 print:text-black">
            <div>
              <span className="text-slate-500 print:text-gray-600 block text-[10px]">CASE DOCKET ID</span>
              <strong className="text-emerald-400 print:text-black text-sm">{caseId}</strong>
            </div>
            <div>
              <span className="text-slate-500 print:text-gray-600 block text-[10px]">REPORTED DATE</span>
              <strong className="text-slate-200 print:text-black">{caseData.createdDate || caseData.createdAt?.split('T')[0] || today}</strong>
            </div>
            <div>
              <span className="text-slate-500 print:text-gray-600 block text-[10px]">DATE OF CLOSURE</span>
              <strong className="text-slate-200 print:text-black">{today}</strong>
            </div>
            <div>
              <span className="text-slate-500 print:text-gray-600 block text-[10px]">CRIME CATEGORY</span>
              <strong className="text-slate-200 print:text-black">{caseData.caseType}</strong>
            </div>
            <div>
              <span className="text-slate-500 print:text-gray-600 block text-[10px]">FINANCIAL LOSS</span>
              <strong className="text-rose-400 print:text-black font-bold">
                ₹{caseData.lossAmount ? Number(caseData.lossAmount).toLocaleString() : '0'}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 print:text-gray-600 block text-[10px]">FINAL STATUS</span>
              <strong className="text-emerald-400 print:text-black font-bold">RESOLVED / CLOSED</strong>
            </div>
          </div>

          {/* Section 1: Complainant Information */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold text-slate-300 print:text-black uppercase tracking-wider border-b border-slate-800 print:border-gray-300 pb-1">
              1. Complainant (Citizen) Information
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-slate-900/40 p-3 rounded-xl border border-slate-800 print:bg-transparent print:border-none">
              <div>
                <span className="text-slate-500 print:text-gray-600 text-[10px] block">NAME:</span>
                <span className="text-slate-200 print:text-black font-semibold">{caseData.victimInfo?.name || caseData.userName || 'Citizen'}</span>
              </div>
              <div>
                <span className="text-slate-500 print:text-gray-600 text-[10px] block">PHONE:</span>
                <span className="text-slate-200 print:text-black">{caseData.victimInfo?.phone || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 print:text-gray-600 text-[10px] block">EMAIL:</span>
                <span className="text-slate-200 print:text-black">{caseData.victimInfo?.email || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 print:text-gray-600 text-[10px] block">AFFECTED BANK:</span>
                <span className="text-slate-200 print:text-black">{caseData.victimInfo?.bankName || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Complaint Brief */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold text-slate-300 print:text-black uppercase tracking-wider border-b border-slate-800 print:border-gray-300 pb-1">
              2. Incident Description & Scope
            </h3>
            <p className="text-xs text-slate-300 print:text-gray-800 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-800 print:bg-transparent print:border-none">
              {caseData.description}
            </p>
          </div>

          {/* Section 3: Police Investigation Findings & Resolution Outcome */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold text-emerald-400 print:text-black uppercase tracking-wider border-b border-slate-800 print:border-gray-300 pb-1">
              3. Cyber Crime Investigation Findings & Actions Taken
            </h3>
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs font-mono space-y-2 print:bg-gray-50 print:border-gray-300">
              <p className="text-slate-200 print:text-black">
                <strong>Officer Remarks: </strong>
                {caseData.officerNotes || 'The reported transaction/complaint has been thoroughly examined by the digital forensics cell. Nodal bank notices and suspect freeze requests were processed successfully.'}
              </p>
              <div className="pt-2 border-t border-emerald-500/20 print:border-gray-300 text-[11px] text-slate-400 print:text-gray-700 space-y-1">
                <p>✔ Digital Evidence Authenticated & SHA-256 Hashes Verified.</p>
                <p>✔ Suspect beneficiary identifiers flagged in State Cyber Threat Database.</p>
                <p>✔ Action report archived under Section 66D Information Technology Act.</p>
              </div>
            </div>
          </div>

          {/* Footer Signatures & Official Stamp */}
          <div className="pt-6 border-t-2 border-slate-800 print:border-black flex items-center justify-between font-mono text-xs">
            <div className="space-y-1">
              <div className="inline-block p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 print:border-black print:text-black text-[10px] font-bold">
                [OFFICIAL SEAL: RESOLVED]
              </div>
              <p className="text-[10px] text-slate-500 print:text-gray-600">STATE CYBER CRIME CELL</p>
            </div>

            <div className="text-right space-y-1">
              <p className="font-bold text-slate-200 print:text-black">{caseData.officerName || 'Inspector Vikram Rathore'}</p>
              <p className="text-[10px] text-slate-400 print:text-gray-600">Cyber Forensics & Investigation Desk</p>
              <p className="text-[10px] font-mono text-slate-500 print:text-gray-600">Badge: CYB-IND-709</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseClosureModal;
