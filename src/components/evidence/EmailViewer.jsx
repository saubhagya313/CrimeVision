import React from 'react';
import { Mail, AlertOctagon, CheckCircle2 } from 'lucide-react';

const EmailViewer = ({ ocrText }) => {
  if (!ocrText) return null;

  return (
    <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-cyan-400 font-bold">
          <Mail className="w-4 h-4" />
          <span>EMAIL HEADER & RAW MESSAGE ANALYSIS</span>
        </div>
        <span className="bg-rose-950 text-rose-400 px-2 py-0.5 rounded border border-rose-500/40 text-[10px]">
          SPOOFED DOMAIN
        </span>
      </div>

      <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 space-y-1 text-slate-300">
        <p><strong className="text-slate-400">From:</strong> &quot;Corporate IT Support&quot; &lt;admin-portal-verify@corp-update-sys.net&gt;</p>
        <p><strong className="text-slate-400">To:</strong> v.verma@corp-mail.org</p>
        <p><strong className="text-slate-400">Subject:</strong> <span className="text-rose-400 font-semibold">URGENT: Mandatory Password Re-Authentication Required</span></p>
        <p><strong className="text-slate-400">SPF/DKIM:</strong> <span className="text-rose-400 font-semibold">FAIL (Unverified Origin IP)</span></p>
      </div>

      <div className="p-4 bg-slate-900/40 rounded-lg border border-slate-800 text-slate-200 leading-relaxed font-sans text-xs whitespace-pre-wrap">
        {ocrText}
      </div>
    </div>
  );
};

export default EmailViewer;
