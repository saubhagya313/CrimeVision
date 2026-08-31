import React from 'react';
import { ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

const FraudIndicator = ({ name, explanation, reference, confidence = 85, weight }) => {
  return (
    <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all space-y-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-slate-100">{name}</h4>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {weight && (
            <span className="text-xs font-mono font-semibold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
              +{weight} Risk Pts
            </span>
          )}
          <span className="text-xs font-mono font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
            {confidence}% Confidence
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed pl-8">
        {explanation}
      </p>

      {reference && (
        <div className="ml-8 p-2 rounded bg-slate-900/90 border border-slate-800/80 flex items-center gap-2 text-xs font-mono text-slate-400">
          <FileText className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          <span className="truncate">Ref: {reference}</span>
        </div>
      )}
    </div>
  );
};

export default FraudIndicator;
