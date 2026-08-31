import React from 'react';
import { FileText, Image, MessageSquare, Mail, CreditCard, ChevronRight, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RiskBadge from '../common/RiskBadge';

const getFileIcon = (fileType) => {
  switch (fileType?.toLowerCase()) {
    case 'images':
    case 'image':
      return Image;
    case 'chats':
    case 'chat':
      return MessageSquare;
    case 'emails':
    case 'email':
      return Mail;
    case 'transactions':
    case 'transaction':
      return CreditCard;
    default:
      return FileText;
  }
};

const EvidenceCard = ({ evidence }) => {
  const navigate = useNavigate();
  const Icon = getFileIcon(evidence.fileType);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'analyzed':
      case 'completed':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/40">ANALYZED</span>;
      case 'processing':
      case 'ocr processing...':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-500/40 animate-pulse">PROCESSING</span>;
      case 'failed':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-500/40">FAILED</span>;
      default:
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">UPLOADED</span>;
    }
  };

  return (
    <div
      onClick={() => navigate(`/evidence/${evidence.id}`)}
      className="glass-panel rounded-xl border border-slate-800 hover:border-cyan-500/40 glass-panel-hover p-4 cursor-pointer transition-all flex flex-col justify-between group"
    >
      <div>
        {/* Header & Risk */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 group-hover:border-cyan-500/40 transition-colors">
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono font-medium text-slate-400 uppercase">{evidence.fileType}</span>
          </div>
          <RiskBadge level={evidence.riskLevel} />
        </div>

        {/* Thumbnail Preview if Image */}
        {evidence.thumbnail && (
          <div className="h-28 w-full rounded-lg overflow-hidden border border-slate-800 mb-3 relative bg-slate-950">
            <img src={evidence.thumbnail} alt={evidence.fileName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2">
              <span className="text-[10px] font-mono text-slate-300 truncate">{evidence.hash?.slice(0, 16)}...</span>
            </div>
          </div>
        )}

        {/* File Name & Metadata */}
        <h4 className="text-sm font-semibold text-slate-100 font-mono truncate group-hover:text-cyan-400 transition-colors">
          {evidence.fileName}
        </h4>

        <div className="mt-2 space-y-1 text-xs text-slate-400 font-mono">
          <p className="flex justify-between">
            <span>Case:</span> <span className="text-cyan-300 font-semibold">{evidence.caseId}</span>
          </p>
          <p className="flex justify-between">
            <span>File Size:</span> <span>{evidence.fileSize}</span>
          </p>
          <p className="flex justify-between">
            <span>Uploaded:</span> <span>{evidence.uploadDate?.split(' ')[0]}</span>
          </p>
        </div>
      </div>

      {/* Footer Status */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        {getStatusBadge(evidence.processingStatus)}
        <span className="text-slate-400 group-hover:text-cyan-400 flex items-center gap-1 font-mono transition-colors">
          View Forensic Data <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};

export default EvidenceCard;
