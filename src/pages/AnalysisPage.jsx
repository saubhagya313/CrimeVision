import React, { useState } from 'react';
import { Cpu, Play, CheckCircle2, ShieldAlert, Sparkles, FileText, ArrowRight } from 'lucide-react';
import RiskBadge from '../components/common/RiskBadge';
import RiskScore from '../components/common/RiskScore';
import { EntityCard } from '../components/common/EntityTag';
import FraudIndicator from '../components/common/FraudIndicator';
import { useCase } from '../context/CaseContext';
import { analysisApi } from '../services/api';

const analysisTypes = [
  { id: 'Fraud Detection', name: 'Fraud Detection Scan', desc: 'Identify coercive language, PIN prompts & Scam signatures' },
  { id: 'Entity Extraction', name: 'Entity & Token Extraction', desc: 'Extract phones, VPAs, URLs, transaction IDs & names' },
  { id: 'Suspicious URL Detection', name: 'Suspicious URL Analysis', desc: 'Check domain registration, typosquatting & phishing hosting' },
  { id: 'Transaction Analysis', name: 'Transaction & Bank Flow', desc: 'Map NPCI reference numbers & Jamtara IP clusters' },
  { id: 'Conversation Analysis', name: 'Conversation Sentiment', desc: 'Detect pressure phrasing, impersonation & fake proofs' },
  { id: 'Cross-Evidence Analysis', name: 'Cross-Evidence Correlation', desc: 'Correlate WhatsApp chats with HDFC bank advice PDFs' }
];

const AnalysisPage = () => {
  const { cases, evidenceList, showToast } = useCase();

  const [selectedCaseId, setSelectedCaseId] = useState(cases[0]?.id || 'CV-2026-001');
  const [selectedEvidenceId, setSelectedEvidenceId] = useState('All');
  const [selectedAnalysisType, setSelectedAnalysisType] = useState('Fraud Detection');

  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState(null);

  const handleRunAnalysis = async () => {
    setScanning(true);
    try {
      const data = await analysisApi.runAnalysis({
        caseId: selectedCaseId,
        evidenceId: selectedEvidenceId,
        analysisType: selectedAnalysisType
      });
      setResults(data);
      showToast(`Analysis scan complete for ${selectedAnalysisType}!`, 'success');
    } catch (err) {
      showToast('Analysis scan failed', 'error');
    } finally {
      setScanning(false);
    }
  };

  const caseEvidence = evidenceList.filter(e => e.caseId === selectedCaseId);

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-slate-100">AI Forensics & Evidence Analysis Hub</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Run automated fraud detection, entity extraction, and cross-evidence pattern matching
          </p>
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={scanning}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider shadow-cyan-glow transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {scanning ? (
            <>
              <Cpu className="w-4 h-4 animate-spin" />
              <span>Scanning Evidence...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Run Analysis Scan</span>
            </>
          )}
        </button>
      </div>

      {/* Configurator Box */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
          Select Investigation Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">Target Case</label>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
            >
              {cases.map(c => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">Scope of Evidence</label>
            <select
              value={selectedEvidenceId}
              onChange={(e) => setSelectedEvidenceId(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Ingested Evidence in Case ({caseEvidence.length} Files)</option>
              {caseEvidence.map(e => (
                <option key={e.id} value={e.id}>
                  {e.fileName} ({e.fileType})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Analysis Type Selection Cards */}
        <div>
          <label className="text-xs font-mono text-slate-400 block mb-2">Analysis Type Algorithm</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {analysisTypes.map(t => (
              <div
                key={t.id}
                onClick={() => setSelectedAnalysisType(t.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-1 ${
                  selectedAnalysisType === t.id
                    ? 'bg-cyan-950/40 border-cyan-500/60 shadow-cyan-glow'
                    : 'bg-slate-900/50 hover:bg-slate-800 border-slate-800'
                }`}
              >
                <h4 className="text-xs font-mono font-bold text-slate-100 flex items-center justify-between">
                  <span>{t.name}</span>
                  {selectedAnalysisType === t.id && <Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
                </h4>
                <p className="text-[11px] text-slate-400 leading-snug">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Results View */}
      {results && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Analysis Results Summary ({results.scannedDate})
            </h3>
            <RiskBadge level={results.riskLevel} />
          </div>

          <RiskScore score={results.riskScore} level={results.riskLevel} />

          {/* AI Narrative Explanation */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              AI Forensic Scan Synthesis
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {results.summary}
            </p>
          </div>

          {/* Indicators list */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
              Detected High-Confidence Indicators
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {results.detectedIndicators?.map((ind, idx) => (
                <FraudIndicator key={idx} {...ind} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;
