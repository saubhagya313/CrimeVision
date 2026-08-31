import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText,
  ArrowLeft,
  Shield,
  Copy,
  Check,
  Cpu,
  FileCheck,
  Search,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import RiskBadge from '../components/common/RiskBadge';
import RiskScore from '../components/common/RiskScore';
import { EntityCard } from '../components/common/EntityTag';
import FraudIndicator from '../components/common/FraudIndicator';
import ChatViewer from '../components/evidence/ChatViewer';
import EmailViewer from '../components/evidence/EmailViewer';
import { evidenceApi } from '../services/api';

const EvidenceDetailPage = () => {
  const { evidenceId } = useParams();
  const navigate = useNavigate();

  const [evidence, setEvidence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchEvidence = async () => {
      setLoading(true);
      try {
        const item = await evidenceApi.getEvidenceById(evidenceId || 'EVD-001');
        setEvidence(item);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvidence();
  }, [evidenceId]);

  if (loading || !evidence) {
    return (
      <div className="p-12 text-center font-mono text-cyan-400 animate-pulse">
        Extracting OCR and analyzing evidence vectors for {evidenceId}...
      </div>
    );
  }

  const handleCopyText = () => {
    navigator.clipboard.writeText(evidence.ocrText || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate('/evidence')}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Evidence Directory
      </button>

      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-500/40">
              {evidence.id}
            </span>
            <RiskBadge level={evidence.riskLevel} />
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700">
              {evidence.processingStatus}
            </span>
          </div>
          <h1 className="text-2xl font-black font-mono text-slate-100">{evidence.fileName}</h1>
          <p className="text-xs font-mono text-slate-400">
            Case Reference: <strong className="text-cyan-400 font-semibold cursor-pointer hover:underline" onClick={() => navigate(`/cases/${evidence.caseId}`)}>{evidence.caseId}</strong> • Uploaded: {evidence.uploadDate}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/analysis/${evidence.caseId}`)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider shadow-cyan-glow transition-all flex items-center gap-2"
          >
            <Cpu className="w-4 h-4" />
            <span>Re-Run Deep Scan</span>
          </button>
        </div>
      </div>

      {/* Two-Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Evidence Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Visual Preview */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Digital Artifact Inspection ({evidence.fileType})
              </h3>
              <span className="text-[11px] font-mono text-slate-400">{evidence.fileSize}</span>
            </div>

            {/* Render Preview according to Evidence Type */}
            {evidence.fileType === 'Chats' ? (
              <ChatViewer ocrText={evidence.ocrText} />
            ) : evidence.fileType === 'Emails' ? (
              <EmailViewer ocrText={evidence.ocrText} />
            ) : (
              <div className="space-y-4">
                {evidence.thumbnail && (
                  <div className="w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                    <img src={evidence.thumbnail} alt={evidence.fileName} className="w-full max-h-96 object-contain" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* OCR & Raw Extracted Text Block */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4" /> Extracted Text (OCR / Payload)
              </h3>
              <button
                onClick={handleCopyText}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">
              {evidence.ocrText}
            </div>
          </div>
        </div>

        {/* Right Column: Information, Entities & Risk (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Metadata Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
              Forensic Hash & Metadata
            </h3>
            <div className="space-y-2 text-slate-400">
              <p className="flex justify-between">
                <span>File Name:</span> <strong className="text-slate-200">{evidence.fileName}</strong>
              </p>
              <p className="flex justify-between">
                <span>MIME Type:</span> <span>{evidence.mimeType}</span>
              </p>
              <p className="flex justify-between">
                <span>Processing Engine:</span> <span className="text-cyan-400">CrimeVision OCR v3</span>
              </p>
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase block mb-1">SHA-256 Checksum Hash</span>
                <p className="p-2 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300 break-all">
                  {evidence.hash}
                </p>
              </div>
            </div>
          </div>

          {/* Risk Matrix Score */}
          <RiskScore score={evidence.riskScore || 87} level={evidence.riskLevel} />

          {/* Extracted Entities */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              Extracted Entities ({evidence.extractedEntities?.length || 0})
            </h3>
            <div className="space-y-2.5">
              {evidence.extractedEntities?.map((ent, idx) => (
                <EntityCard key={idx} {...ent} />
              ))}
            </div>
          </div>

          {/* Detected Suspicious Indicators */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              Detected Suspicious Indicators ({evidence.fraudIndicators?.length || 0})
            </h3>
            <div className="space-y-3">
              {evidence.fraudIndicators?.map((ind, idx) => (
                <FraudIndicator key={idx} {...ind} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenceDetailPage;
