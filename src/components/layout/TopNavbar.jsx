import React, { useState } from 'react';
import { Menu, Search, Bell, Shield, PhoneCall, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCase } from '../../context/CaseContext';
import NotificationDropdown from '../common/NotificationDropdown';

const TopNavbar = ({ onOpenMobileMenu }) => {
  const { user } = useAuth();
  const { setIsSearchOpen, notifications } = useCase();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  const isAdmin = user?.role === 'Admin';
  const unreadCount = notifications.filter((n) => !n.read).length;

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
          className="flex items-center gap-2.5 px-3.5 py-1.5 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 rounded-xl text-slate-400 text-xs font-mono transition-all w-44 sm:w-72 group shadow-inner"
        >
          <Search className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="truncate">Search analyses, suspects, numbers...</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* National Cyber Helpline 1930 Pill */}
        <a
          href="tel:1930"
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono font-semibold hover:bg-rose-500/25 transition-colors"
          title="National Cyber Crime Helpline"
        >
          <PhoneCall className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span>Helpline: 1930</span>
        </a>

        {/* Quick Action Button for Citizen */}
        {!isAdmin && (
          <button
            onClick={() => navigate('/analyze')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-cyan-glow transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Analyze Evidence</span>
          </button>
        )}

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

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
              isAdmin
                ? 'bg-amber-500 text-slate-950'
                : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950'
            }`}
          >
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
