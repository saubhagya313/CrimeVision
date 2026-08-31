import React from 'react';
import { FileCheck, Download, Printer, Eye, Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReportCard = ({ report }) => {
  const navigate = useNavigate();

  return (
    <div className="glass-panel p-5 rounded-xl border border-slate-800 hover:border-cyan-500/40 glass-panel-hover flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <FileCheck className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
            OFFICIAL REPORT
          </span>
        </div>

        <div>
          <span className="text-[11px] font-mono text-cyan-400 uppercase font-semibold">{report.reportType}</span>
          <h4 className="text-sm font-bold text-slate-100 font-sans mt-0.5 line-clamp-1">{report.caseTitle}</h4>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{report.summary}</p>
        </div>

        <div className="pt-2 space-y-1 text-[11px] font-mono text-slate-400 border-t border-slate-800/80">
          <p className="flex justify-between">
            <span>Report ID:</span> <span className="text-slate-200">{report.id}</span>
          </p>
          <p className="flex justify-between">
            <span>Case Reference:</span> <span className="text-cyan-300 font-semibold">{report.caseId}</span>
          </p>
          <p className="flex justify-between">
            <span>Generated Date:</span> <span>{report.createdDate}</span>
          </p>
          <p className="flex justify-between">
            <span>Authoring Officer:</span> <span>{report.author}</span>
          </p>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
        <button
          onClick={() => navigate(`/reports/${report.id}`)}
          className="flex-1 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>View Report</span>
        </button>

        <button
          onClick={() => window.print()}
          className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors"
          title="Print Document"
        >
          <Printer className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ReportCard;
