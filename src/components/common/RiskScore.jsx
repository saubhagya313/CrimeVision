import React from 'react';
import { AlertOctagon, Info, ShieldAlert } from 'lucide-react';
import RiskBadge from './RiskBadge';

const RiskScore = ({ score = 87, level = 'High', factors = [] }) => {
  const getGaugeColor = () => {
    if (score >= 85) return 'from-rose-500 to-red-600 text-rose-400';
    if (score >= 65) return 'from-orange-500 to-amber-500 text-amber-400';
    if (score >= 40) return 'from-amber-400 to-yellow-500 text-yellow-400';
    return 'from-emerald-400 to-teal-500 text-emerald-400';
  };

  const defaultFactors = [
    { name: 'Suspicious Phishing URL Match', weight: 20 },
    { name: 'QR PIN Prompt Misdirection', weight: 28 },
    { name: 'High Urgency & Pressure Phrasing', weight: 18 },
    { name: 'High-Risk Geolocation (Jamtara Cluster)', weight: 24 }
  ];

  const activeFactors = factors.length > 0 ? factors : defaultFactors;

  return (
    <div className="glass-panel p-6 rounded-xl border border-slate-800 relative">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-semibold text-slate-100 uppercase tracking-wider">
            Risk Analysis Matrix
          </h3>
        </div>
        <RiskBadge level={level} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Score Radial / Visual Gauge */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-900/60 rounded-xl border border-slate-800/80">
          <div className="relative flex items-center justify-center w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`transition-all duration-1000 stroke-current text-cyan-400`}
                strokeDasharray={`${score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold font-mono text-slate-100">{score}%</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">FRAUD SCORE</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400 font-mono text-center">
            Calculated via AI Pattern Engine
          </p>
        </div>

        {/* Contributing Factors */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Contributing Risk Vectors
          </h4>
          {activeFactors.map((factor, idx) => (
            <div key={idx} className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">{factor.name || factor.title}</span>
              <span className="font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                +{factor.weight || factor.score || 20} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Legal & Investigative Disclaimer */}
      <div className="mt-5 p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-300">Investigative Note:</strong> This assessment evaluates <em className="text-slate-200">Potential Fraud Indicators</em> derived from automated pattern scoring. It serves as decision support for law enforcement and does not constitute absolute legal proof of criminal liability.
        </p>
      </div>
    </div>
  );
};

export default RiskScore;
