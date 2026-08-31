import React, { useState } from 'react';
import { Menu, Search, Bell, Plus, Upload, ShieldCheck, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCase } from '../../context/CaseContext';
import NotificationDropdown from '../common/NotificationDropdown';

const TopNavbar = ({ onOpenMobileMenu }) => {
  const { user } = useAuth();
  const { setIsSearchOpen, notifications } = useCase();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 h-16 glass-panel border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between">
      {/* Mobile Toggle & Search Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-3 px-3.5 py-1.5 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 rounded-xl text-slate-400 text-xs font-mono transition-all w-48 sm:w-80 group shadow-inner"
        >
          <Search className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="truncate">Search cases, evidence, numbers...</span>
          <kbd className="hidden sm:inline-block ml-auto text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* System Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>FASTAPI READY</span>
        </div>

        {/* Quick Action Buttons */}
        <button
          onClick={() => navigate('/cases/new')}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider shadow-cyan-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Case</span>
        </button>

        <button
          onClick={() => navigate('/evidence/upload')}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition-colors"
        >
          <Upload className="w-3.5 h-3.5 text-cyan-400" />
          <span>Upload</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 relative transition-colors"
          >
            <Bell className="w-4 h-4 text-cyan-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-mono font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <NotificationDropdown
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />
        </div>

        {/* User Quick Menu */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
            alt="Avatar"
            onClick={() => navigate('/settings')}
            className="w-8 h-8 rounded-lg object-cover ring-1 ring-cyan-500/50 cursor-pointer hover:opacity-90 transition-opacity"
          />
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
