import React from 'react';
import { Clock, FileText, ArrowUpRight, DollarSign, Phone, Mail, MessageSquare, AlertOctagon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RiskBadge from '../common/RiskBadge';

const getCategoryIcon = (cat) => {
  switch (cat?.toLowerCase()) {
    case 'messages':
      return MessageSquare;
    case 'transactions':
      return DollarSign;
    case 'emails':
      return Mail;
    case 'calls':
      return Phone;
    default:
      return Clock;
  }
};

const TimelineEvent = ({ event, isLast }) => {
  const navigate = useNavigate();
  const Icon = getCategoryIcon(event.category);

  return (
    <div className="relative pl-8 pb-8 group">
      {/* Vertical Connecting Line */}
      {!isLast && (
        <span
          className="absolute left-3.5 top-8 -bottom-2 w-0.5 bg-slate-800 group-hover:bg-cyan-500/40 transition-colors"
          aria-hidden="true"
        />
      )}

      {/* Node Dot */}
      <div className={`absolute left-0 top-1 w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
        event.risk === 'Critical'
          ? 'bg-rose-950 text-rose-400 border-rose-500/60 shadow-rose-glow'
          : event.risk === 'High'
          ? 'bg-orange-950 text-orange-400 border-orange-500/60'
          : 'bg-slate-900 text-cyan-400 border-slate-700'
      }`}>
        <Icon className="w-3.5 h-3.5" />
      </div>

      {/* Main Content Card */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <span className="text-cyan-400 font-semibold">{event.date}</span>
            <span>•</span>
            <span>{event.time}</span>
            <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[10px] uppercase">
              {event.category}
            </span>
          </div>
          <RiskBadge level={event.risk} showIcon={false} />
        </div>

        <h4 className="text-sm font-bold text-slate-100 font-sans tracking-tight">{event.title}</h4>

        <p className="text-xs text-slate-300 leading-relaxed">{event.description}</p>

        {/* Footer Meta & Source Link */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-3">
            {event.entity && (
              <span className="text-slate-400">
                Entity: <strong className="text-cyan-300 font-semibold">{event.entity}</strong>
              </span>
            )}
            {event.amount && (
              <span className="text-rose-400 font-semibold bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
                Debited: {event.amount}
              </span>
            )}
          </div>

          {event.sourceEvidence && (
            <button
              onClick={() => navigate(`/evidence/${event.evidenceId || 'EVD-001'}`)}
              className="inline-flex items-center gap-1 text-cyan-400 hover:underline text-[11px]"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Source: {event.sourceEvidence}</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineEvent;
