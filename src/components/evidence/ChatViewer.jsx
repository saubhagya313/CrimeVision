import React from 'react';
import { MessageSquare, ShieldAlert, CheckCheck } from 'lucide-react';

const ChatViewer = ({ ocrText }) => {
  if (!ocrText) return null;

  const lines = ocrText.split('\n').filter(l => l.trim().length > 0);

  return (
    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-sans">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono text-slate-400">
        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <MessageSquare className="w-3.5 h-3.5" /> WHATSAPP CHAT FORENSIC THREAD
        </span>
        <span>E2EE Extracted Audit</span>
      </div>

      <div className="space-y-3 py-2">
        {lines.map((line, idx) => {
          const isSuspect = line.toLowerCase().includes('suspect') || line.toLowerCase().includes('+91 98123');
          const isSystem = line.toLowerCase().includes('system') || line.toLowerCase().includes('payment of');

          if (isSystem) {
            return (
              <div key={idx} className="my-2 p-2 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono text-center flex items-center justify-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{line}</span>
              </div>
            );
          }

          return (
            <div
              key={idx}
              className={`flex flex-col ${isSuspect ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-xs space-y-1 ${
                  isSuspect
                    ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                    : 'bg-cyan-950/60 border border-cyan-500/40 text-cyan-100 rounded-tr-none'
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-[10px] font-mono opacity-60 pb-1">
                  <span>{isSuspect ? 'SUSPECT' : 'VICTIM'}</span>
                  <span>{line.slice(0, 20)}</span>
                </div>
                <p className="leading-relaxed">{line.replace(/^\[.*?\]\s*/, '')}</p>
                <div className="flex justify-end text-[9px] opacity-40">
                  <CheckCheck className="w-3 h-3 text-cyan-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatViewer;
