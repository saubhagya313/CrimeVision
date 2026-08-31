import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, color = 'cyan', subtext }) => {
  const isPositive = change?.startsWith('+');

  const getColorClasses = () => {
    switch (color) {
      case 'rose':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'amber':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'emerald':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'blue':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'cyan':
      default:
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
    }
  };

  return (
    <div className="glass-panel p-5 rounded-xl border border-slate-800/80 glass-panel-hover relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-100 font-mono tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg border ${getColorClasses()}`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        {change && (
          <span className={`inline-flex items-center font-mono font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
            {change} <span className="text-slate-500 ml-1">vs last month</span>
          </span>
        )}
        {subtext && <span className="text-slate-400 font-mono">{subtext}</span>}
      </div>

      {/* Subtle corner light accent */}
      <div className="absolute top-0 right-0 -mt-2 -mr-2 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/10 to-transparent blur-md group-hover:from-cyan-500/20 transition-all pointer-events-none" />
    </div>
  );
};

export default StatCard;
