import React, { useState } from 'react';
import { Bot, Folder } from 'lucide-react';
import AIChat from '../components/ai/AIChat';
import { useCase } from '../context/CaseContext';

const AIAssistantPage = () => {
  const { cases } = useCase();
  const [selectedCaseId, setSelectedCaseId] = useState(cases[0]?.id || 'CV-2026-001');

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-slate-100">CrimeVision AI Assistant Workstation</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Query ingested evidence using natural language to summarize cases, retrieve phone numbers, and cross-examine transactions
          </p>
        </div>

        {/* Case Switcher */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-mono text-slate-400">Target Case:</label>
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 font-mono text-xs focus:outline-none focus:border-cyan-500"
          >
            {cases.map(c => (
              <option key={c.id} value={c.id}>
                {c.id} — {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main AI Chat Interface */}
      <AIChat caseId={selectedCaseId} />
    </div>
  );
};

export default AIAssistantPage;
