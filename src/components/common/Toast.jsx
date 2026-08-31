import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useCase } from '../../context/CaseContext';

const Toast = () => {
  const { toast } = useCase();

  if (!toast) return null;

  const getStyle = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50 shadow-cyan-glow';
      case 'error':
        return 'bg-rose-950/90 text-rose-200 border-rose-500/50 shadow-rose-glow';
      case 'warning':
        return 'bg-amber-950/90 text-amber-200 border-amber-500/50';
      default:
        return 'bg-slate-900/90 text-cyan-200 border-cyan-500/50 shadow-cyan-glow';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-cyan-400 flex-shrink-0" />;
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md transition-all duration-300 ${getStyle()}`}>
      {getIcon()}
      <p className="text-xs font-mono font-medium">{toast.message}</p>
    </div>
  );
};

export default Toast;
