import React, { useState } from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCase } from '../../context/CaseContext';

const NotificationDropdown = ({ isOpen, onClose }) => {
  const { notifications } = useCase();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNotificationClick = (link) => {
    onClose();
    if (link) navigate(link);
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel rounded-2xl border border-slate-700/80 shadow-card-dark overflow-hidden z-50 animate-fade-in">
      <div className="p-3.5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-mono font-bold text-slate-100 uppercase tracking-wider">
            Investigation Alerts
          </h4>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
          {notifications.filter(n => !n.read).length} Unread
        </span>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => handleNotificationClick(n.link)}
            className={`p-3.5 hover:bg-slate-800/80 cursor-pointer transition-colors flex items-start gap-3 ${!n.read ? 'bg-cyan-950/20' : ''}`}
          >
            <div className="mt-0.5">
              {n.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              ) : n.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Info className="w-4 h-4 text-cyan-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200">{n.title}</p>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{n.message}</p>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">{n.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationDropdown;
