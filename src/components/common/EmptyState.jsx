import React from 'react';
import { FolderSearch, Plus } from 'lucide-react';

const EmptyState = ({ title = 'No records found', description = 'There are no items to display at this time.', icon: Icon = FolderSearch, actionText, onAction }) => {
  return (
    <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center my-6">
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-cyan-400 mb-4 shadow-cyan-glow">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-lg font-semibold text-slate-100 font-mono mb-1">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-cyan-glow"
        >
          <Plus className="w-4 h-4" />
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
