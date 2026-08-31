import React, { useState } from 'react';
import { Search, Folder, FileText, Phone, Hash, Link as LinkIcon, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCase } from '../../context/CaseContext';
import Modal from './Modal';

const GlobalSearchModal = () => {
  const { isSearchOpen, setIsSearchOpen, cases, evidenceList } = useCase();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  if (!isSearchOpen) return null;

  const q = query.trim().toLowerCase();

  // Search cases
  const matchingCases = q
    ? cases.filter(c => c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.victimInfo.phone.includes(q))
    : cases.slice(0, 3);

  // Search evidence
  const matchingEvidence = q
    ? evidenceList.filter(e => e.fileName.toLowerCase().includes(q) || e.ocrText.toLowerCase().includes(q))
    : evidenceList.slice(0, 3);

  const handleSelectCase = (caseId) => {
    setIsSearchOpen(false);
    navigate(`/cases/${caseId}`);
  };

  const handleSelectEvidence = (evidenceId) => {
    setIsSearchOpen(false);
    navigate(`/evidence/${evidenceId}`);
  };

  return (
    <Modal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} title="CrimeVision Global Search" maxWidth="max-w-3xl">
      <div className="space-y-4">
        {/* Input Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-cyan-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cases, evidence, phone numbers (+91), transaction IDs, URLs..."
            className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        {/* Categories / Results */}
        <div className="space-y-4 pt-2">
          {/* Cases Result */}
          <div>
            <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Folder className="w-3.5 h-3.5 text-cyan-400" /> Cases ({matchingCases.length})
            </h4>
            <div className="space-y-1.5">
              {matchingCases.map(c => (
                <div
                  key={c.id}
                  onClick={() => handleSelectCase(c.id)}
                  className="p-3 rounded-lg bg-slate-900/50 hover:bg-slate-800 border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                      {c.id}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{c.title}</p>
                      <p className="text-xs text-slate-400 font-mono">Victim: {c.victimInfo.name} ({c.victimInfo.phone})</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Result */}
          <div>
            <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-cyan-400" /> Digital Evidence Files ({matchingEvidence.length})
            </h4>
            <div className="space-y-1.5">
              {matchingEvidence.map(e => (
                <div
                  key={e.id}
                  onClick={() => handleSelectEvidence(e.id)}
                  className="p-3 rounded-lg bg-slate-900/50 hover:bg-slate-800 border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-slate-400">{e.fileType}</span>
                    <div>
                      <p className="text-sm font-mono font-semibold text-slate-200">{e.fileName}</p>
                      <p className="text-xs text-slate-400 font-mono">Case: {e.caseId} • Risk: {e.riskLevel}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default GlobalSearchModal;
