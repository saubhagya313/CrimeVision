import React, { useState } from 'react';
import { Shield, Printer, Download, Edit3, Save, CheckCircle2, FileText, AlertTriangle } from 'lucide-react';
import RiskBadge from '../common/RiskBadge';

const ReportPreview = ({ report, targetCase, evidenceItems = [], timelineEvents = [] }) => {
  const [notes, setNotes] = useState(
    'RECOMMENDATION: Issued official notice under Section 91 CrPC to payment gateway (Paytm) for immediate freezing of VPA paytmqr-fastpay@paytm and request for KYC details & IP logs of Fastpay Global Enterprises.'
  );
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-mono font-bold text-slate-200">
            OFFICIAL DIGITAL FORENSICS INVESTIGATION REPORT
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditingNotes(!isEditingNotes)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isEditingNotes ? 'Done Editing' : 'Edit Notes'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span>Print Report</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider shadow-cyan-glow flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Document Box */}
      <div className="bg-slate-950 text-slate-100 p-8 sm:p-12 rounded-2xl border border-slate-800 shadow-2xl space-y-8 font-sans print:bg-white print:text-black print:p-0 print:border-none">
        {/* Document Header */}
        <div className="border-b-2 border-slate-800 print:border-black pb-6 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-cyan-400 print:text-black" />
              <h1 className="text-2xl font-black font-sans uppercase tracking-tight text-slate-100 print:text-black">
                CrimeVision Forensic Dossier
              </h1>
            </div>
            <p className="text-xs font-mono text-slate-400 print:text-gray-700">
              STATE CYBER CRIME DIRECTORATE • DIGITAL EVIDENCE & FINANCIAL FRAUD UNIT
            </p>
          </div>

          <div className="text-right font-mono text-xs text-slate-400 print:text-gray-700 space-y-0.5">
            <p className="font-bold text-cyan-400 print:text-black">DOSSIER ID: {report?.id || 'REP-2026-089'}</p>
            <p>Date: {report?.createdDate || '2026-08-28'}</p>
            <p>Classification: RESTRICTED / LAW ENFORCEMENT ONLY</p>
          </div>
        </div>

        {/* 1. Case Summary Table */}
        <div className="space-y-3">
          <h2 className="text-sm font-mono font-bold text-cyan-400 print:text-black uppercase tracking-wider border-b border-slate-800 print:border-gray-400 pb-1">
            1. Case Identification & Overview
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-900/60 print:bg-gray-100 border border-slate-800 print:border-gray-300 font-mono text-xs">
            <div>
              <span className="text-slate-500 print:text-gray-600 block text-[10px]">CASE NUMBER</span>
              <strong className="text-slate-100 print:text-black font-bold">{targetCase?.id || 'CV-2026-001'}</strong>
            </div>
            <div>
              <span className="text-slate-500 print:text-gray-600 block text-[10px]">INCIDENT TYPE</span>
              <strong className="text-slate-100 print:text-black">{targetCase?.caseType || 'Online Payment Fraud'}</strong>
            </div>
            <div>
              <span className="text-slate-500 print:text-gray-600 block text-[10px]">RISK ASSESSMENT</span>
              <RiskBadge level={targetCase?.riskLevel || 'High'} />
            </div>
            <div>
              <span className="text-slate-500 print:text-gray-600 block text-[10px]">CURRENT STATUS</span>
              <strong className="text-emerald-400 print:text-green-800">{targetCase?.status || 'Active'}</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 print:bg-gray-50 border border-slate-800 print:border-gray-200 text-xs text-slate-300 print:text-gray-800 leading-relaxed">
            <h4 className="font-mono font-bold text-slate-200 print:text-black mb-1">INCIDENT DESCRIPTION:</h4>
            <p>{targetCase?.description || 'Victim was lured into scanning a fraudulent UPI QR code promising cashback of ₹18,500. Money was transferred to an unverified merchant VPA paytmqr-fastpay@paytm.'}</p>
          </div>
        </div>

        {/* 2. Victim & Complainant Details */}
        <div className="space-y-3">
          <h2 className="text-sm font-mono font-bold text-cyan-400 print:text-black uppercase tracking-wider border-b border-slate-800 print:border-gray-400 pb-1">
            2. Victim / Complainant Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-900/60 print:bg-gray-100 border border-slate-800 print:border-gray-300 font-mono text-xs">
            <div>
              <span className="text-slate-500 print:text-gray-600 block text-[10px]">NAME</span>
              <strong className="text-slate-100 print:text-black">{targetCase?.victimInfo?.name || 'Rajesh Sharma'}</strong>
            </div>
            <div>
              <span className="text-slate-500 print:text-gray-600 block text-[10px]">PHONE</span>
              <strong className="text-slate-100 print:text-black">{targetCase?.victimInfo?.phone || '+91 98765 43210'}</strong>
            </div>
            <div>
              <span className="text-slate-500 print:text-gray-600 block text-[10px]">EMAIL</span>
              <strong className="text-slate-100 print:text-black">{targetCase?.victimInfo?.email || 'r.sharma@example.com'}</strong>
            </div>
          </div>
        </div>

        {/* 3. Extracted Forensic Entities */}
        <div className="space-y-3">
          <h2 className="text-sm font-mono font-bold text-cyan-400 print:text-black uppercase tracking-wider border-b border-slate-800 print:border-gray-400 pb-1">
            3. Key Extracted Entities & Threat Indicators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-slate-900/60 print:bg-gray-100 border border-slate-800 print:border-gray-300 flex justify-between">
              <span className="text-slate-400 print:text-gray-600">Suspect Phone:</span>
              <strong className="text-rose-400 print:text-red-700">+91 98123 45678 (High Risk)</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 print:bg-gray-100 border border-slate-800 print:border-gray-300 flex justify-between">
              <span className="text-slate-400 print:text-gray-600">Fraudulent VPA:</span>
              <strong className="text-rose-400 print:text-red-700">paytmqr-fastpay@paytm</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 print:bg-gray-100 border border-slate-800 print:border-gray-300 flex justify-between">
              <span className="text-slate-400 print:text-gray-600">Phishing Domain:</span>
              <strong className="text-rose-400 print:text-red-700">http://paytm-claim-cashback-instant.net</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 print:bg-gray-100 border border-slate-800 print:border-gray-300 flex justify-between">
              <span className="text-slate-400 print:text-gray-600">NPCI Ref Txn ID:</span>
              <strong className="text-cyan-300 print:text-blue-800">423891004921</strong>
            </div>
          </div>
        </div>

        {/* 4. Investigation Timeline Events */}
        <div className="space-y-3">
          <h2 className="text-sm font-mono font-bold text-cyan-400 print:text-black uppercase tracking-wider border-b border-slate-800 print:border-gray-400 pb-1">
            4. Chronological Sequence of Events
          </h2>
          <div className="space-y-2 font-mono text-xs">
            <div className="p-3 rounded-lg bg-slate-900/40 print:bg-gray-50 border border-slate-800 print:border-gray-200 flex items-start gap-4">
              <span className="text-cyan-400 print:text-black font-bold flex-shrink-0">11:15 AM</span>
              <div>
                <p className="font-bold text-slate-200 print:text-black">Suspect Initiates WhatsApp Contact</p>
                <p className="text-slate-400 print:text-gray-700 text-[11px]">Suspect (+91 98123 45678) promised cashback credit.</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/40 print:bg-gray-50 border border-slate-800 print:border-gray-200 flex items-start gap-4">
              <span className="text-cyan-400 print:text-black font-bold flex-shrink-0">11:18 AM</span>
              <div>
                <p className="font-bold text-slate-200 print:text-black">Delivery of Phishing QR & URL</p>
                <p className="text-slate-400 print:text-gray-700 text-[11px]">Link http://paytm-claim-cashback-instant.net/verify sent.</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/40 print:bg-gray-50 border border-slate-800 print:border-gray-200 flex items-start gap-4">
              <span className="text-rose-400 print:text-red-700 font-bold flex-shrink-0">11:20 AM</span>
              <div>
                <p className="font-bold text-rose-300 print:text-red-800">Financial Transfer Executed (₹18,500)</p>
                <p className="text-slate-400 print:text-gray-700 text-[11px]">Debited to paytmqr-fastpay@paytm via HDFC account xx4921.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Investigator Directives & Notes */}
        <div className="space-y-3">
          <h2 className="text-sm font-mono font-bold text-cyan-400 print:text-black uppercase tracking-wider border-b border-slate-800 print:border-gray-400 pb-1">
            5. Investigator Notes & Action Directives
          </h2>
          {isEditingNotes ? (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
            />
          ) : (
            <div className="p-4 rounded-xl bg-slate-900/80 print:bg-gray-100 border border-slate-800 print:border-gray-300 font-mono text-xs text-slate-200 print:text-black leading-relaxed">
              {notes}
            </div>
          )}
        </div>

        {/* Signatures Block */}
        <div className="pt-8 border-t border-slate-800 print:border-black grid grid-cols-2 gap-8 font-mono text-xs">
          <div className="space-y-8">
            <div className="h-12 border-b border-slate-700 print:border-black flex items-end pb-1 text-slate-400">
              <span className="italic font-sans text-cyan-400 print:text-black font-semibold">Insp. Vikram Singh</span>
            </div>
            <div>
              <p className="font-bold text-slate-200 print:text-black">INSPECTOR VIKRAM SINGH</p>
              <p className="text-slate-400 print:text-gray-600 text-[11px]">Lead Cyber Crime Investigator • Badge #IND-CCU-9842</p>
            </div>
          </div>

          <div className="space-y-8 text-right">
            <div className="h-12 border-b border-slate-700 print:border-black flex items-end justify-end pb-1 text-slate-400">
              <span className="text-emerald-400 print:text-green-800 font-semibold">[DIGITALLY SIGNED & SEALED]</span>
            </div>
            <div>
              <p className="font-bold text-slate-200 print:text-black">SUPERINTENDENT OF POLICE</p>
              <p className="text-slate-400 print:text-gray-600 text-[11px]">State Cyber Crime Directorate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;
