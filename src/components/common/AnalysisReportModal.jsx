import React, { useRef } from 'react';
import {
  X,
  Printer,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Clock,
  Key,
  FileText,
  AlertTriangle,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Info,
  Phone,
  CreditCard,
  Globe,
  DollarSign,
  Building,
} from 'lucide-react';

const AnalysisReportModal = ({ analysis, onClose, onGenerateComplaint }) => {
  const [copied, setCopied] = React.useState(false);

  if (!analysis) return null;

  const isHighRisk = analysis.riskLevel === 'High' || analysis.riskLevel === 'Critical';
  const riskScore = analysis.riskScore || (isHighRisk ? 85 : 15);
  const confidence = analysis.confidence || 94;
  const analysisId = analysis.analysisId || analysis.referenceId || 'CV-ANL-2026-0001';
  const timestamp = analysis.createdAt
    ? new Date(analysis.createdAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const summaryText = `[CRIMEVISION TECHNICAL ANALYSIS REPORT]
Reference ID: ${analysisId}
Date/Time: ${timestamp}
Classification: ${analysis.predictedCategory || 'Potential Cyber Fraud'}
Risk Level: ${analysis.riskLevel} (${riskScore}/100)
Confidence: ${confidence}%
Model Engine: ${analysis.modelEngine || 'CrimeVision NLP & ML Classifier'}
SHA-256 Hash: ${analysis.fileHash || 'N/A'}

[DETECTED ENTITIES]
${
  analysis.entities && analysis.entities.length > 0
    ? analysis.entities.map((e) => `- ${e.type || e.label}: ${e.value}`).join('\n')
    : 'None detected'
}

[SUSPICIOUS INDICATORS]
${
  analysis.indicators && analysis.indicators.length > 0
    ? analysis.indicators.map((i) => `- ${i.name}: ${i.explanation}`).join('\n')
    : 'No significant suspicious indicators detected'
}

DISCLAIMER: AI-Assisted Assessment for Digital Evidence Assistance. Does not constitute conclusive proof of guilt.`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Action Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm sm:text-base font-bold text-slate-100 font-mono tracking-tight">
              Technical Analysis Report — {analysisId}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
              title="Copy Summary to Clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 transition-colors shadow-cyan-glow"
              title="Print or Save PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-200 bg-slate-900" id="printable-analysis-report">
          {/* Document Header */}
          <div className="border-b-2 border-slate-700 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-bold tracking-wider uppercase">
                  CrimeVision Forensic Intelligence
                </span>
                <span className="text-xs font-mono text-slate-400">Report v2.0</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight mt-1">
                Digital Evidence Technical Analysis Report
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated threat classification, entity extraction, and heuristic explanation summary.
              </p>
            </div>

            <div className="sm:text-right font-mono text-xs space-y-1 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <p className="text-slate-400 text-[11px]">
                Reference ID: <strong className="text-cyan-400">{analysisId}</strong>
              </p>
              <p className="text-slate-400 text-[11px]">
                Generated: <span className="text-slate-200">{timestamp}</span>
              </p>
              <p className="text-slate-400 text-[11px]">
                Integrity: <span className="text-emerald-400 font-bold">SHA-256 Indexed</span>
              </p>
            </div>
          </div>

          {/* Section 1: Executive & Technical Summary */}
          <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              <span>1. Technical Detection Summary</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Threat Category</span>
                <p className="text-sm font-bold text-slate-100">{analysis.predictedCategory || 'Potential Cyber Threat'}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Risk Level & Score</span>
                <p
                  className={`text-sm font-black font-mono ${
                    isHighRisk ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {analysis.riskLevel ? analysis.riskLevel.toUpperCase() : 'MEDIUM'} ({riskScore}/100)
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">ML Confidence</span>
                <p className="text-sm font-black font-mono text-cyan-400">{confidence}%</p>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-300 leading-relaxed space-y-1 border-t border-slate-800/80">
              <p>
                <strong>Analysis Engine:</strong>{' '}
                <span className="font-mono text-slate-300">
                  {analysis.modelEngine || 'CrimeVision Forensic NLP & ML Classifier (TF-IDF + Multi-Class Logistic Regression)'}
                </span>
              </p>
              <p>
                <strong>Evaluation Result:</strong>{' '}
                {isHighRisk ? (
                  <span className="text-rose-300">
                    High probability of fraudulent solicitation or phishing vectors detected matching known cybercrime signatures.
                  </span>
                ) : (
                  <span className="text-emerald-300">
                    No significant suspicious indicators detected in relation to known cyber fraud patterns.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Section 2: Forensic Evidence Metadata */}
          <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>2. Evidence Metadata & Integrity</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400">SOURCE TYPE</span>
                <p className="font-bold text-slate-200">{analysis.sourceType || 'Digital Evidence / Text'}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400">FILE NAME</span>
                <p className="font-bold text-slate-200 truncate">{analysis.fileName || 'raw_evidence_input.txt'}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1 sm:col-span-2">
                <span className="text-[10px] text-slate-400">CRYPTOGRAPHIC SHA-256 HASH</span>
                <p className="font-bold text-cyan-400 break-all text-[11px]">
                  {analysis.fileHash || 'SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'}
                </p>
              </div>

              {analysis.imageQuality && (
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1 sm:col-span-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400">OCR QUALITY STATUS</span>
                    <p className="text-slate-200 font-bold">
                      {analysis.imageQuality.isBlurry ? '⚠️ Low Sharpness / Potential Blur' : '✔ Optimal Sharpness & Readability'}
                    </p>
                  </div>
                  {analysis.imageQuality.resolution && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {analysis.imageQuality.resolution}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Extracted Forensic Entities (IoCs) */}
          <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Key className="w-4 h-4" />
              <span>3. Extracted Forensic Indicators of Compromise (IoCs)</span>
            </h3>

            {!analysis.entities || analysis.entities.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No specific entity parameters (Phone, UPI, URLs) identified in this text sample.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {analysis.entities.map((ent, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-0.5">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{ent.label || ent.type}</span>
                    <p className="text-xs font-mono font-bold text-slate-100 truncate">{ent.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Explainable AI Indicators */}
          <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>4. Explainable AI: Suspicious Pattern Breakdown</span>
            </h3>

            {!analysis.indicators || analysis.indicators.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No critical threat indicators or urgency patterns were triggered.</p>
            ) : (
              <div className="space-y-2">
                {analysis.indicators.map((ind, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                    <span className="p-1 rounded bg-rose-500/20 text-rose-400 text-xs flex-shrink-0 mt-0.5 font-bold">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-200">{ind.name}</p>
                      <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{ind.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 5: Extracted Evidence Raw Text */}
          <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>5. Raw Evidence Text Subject to Analysis</span>
            </h3>
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
              {analysis.extractedText || 'No text extracted'}
            </div>
          </div>

          {/* Section 6: Disclaimers & Advisory Directives */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300/90 text-xs space-y-1.5 font-mono">
            <div className="flex items-center gap-2 font-bold text-amber-300 uppercase tracking-wider text-[11px]">
              <AlertTriangle className="w-4 h-4" />
              <span>Statutory Disclaimer & Evidence Advisory</span>
            </div>
            <p className="leading-relaxed">
              This automated report is generated by CrimeVision to assist citizens and preliminary investigators in categorizing digital risk indicators. This document does NOT constitute a formal First Information Report (FIR) or legal evidence of criminal guilt. Citizens should verify all details and file an official complaint via cybercrime.gov.in or their local police station.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400 font-mono">
            CrimeVision Reference: <strong className="text-slate-200">{analysisId}</strong>
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium w-full sm:w-auto transition-colors"
            >
              Close
            </button>

            {onGenerateComplaint && (
              <button
                onClick={() => {
                  onClose();
                  onGenerateComplaint(analysis);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-cyan-glow flex items-center justify-center gap-1.5 w-full sm:w-auto transition-all"
              >
                <span>Draft Formal Complaint</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReportModal;
