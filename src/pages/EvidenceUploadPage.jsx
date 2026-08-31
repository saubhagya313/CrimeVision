import React from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EvidenceUploader from '../components/evidence/EvidenceUploader';

const EvidenceUploadPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in font-sans">
      <button
        onClick={() => navigate('/evidence')}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Evidence Directory
      </button>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center gap-3">
        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
          <Upload className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-100">Upload Digital Evidence</h1>
          <p className="text-xs text-slate-400">
            Upload screenshots, chats, emails, PDFs, transaction receipts, and other investigation files
          </p>
        </div>
      </div>

      <EvidenceUploader />
    </div>
  );
};

export default EvidenceUploadPage;
