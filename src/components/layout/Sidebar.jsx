import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  FolderLock,
  FileSearch,
  Cpu,
  Clock,
  FileCheck,
  Bot,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCase } from '../../context/CaseContext';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Report Cyber Crime', path: '/cases/new', icon: FolderLock, badge: 'New' },
  { name: 'My Complaints', path: '/cases', icon: FileSearch },
  { name: 'Upload Evidence', path: '/evidence/upload', icon: Cpu },
  { name: 'AI Cyber Assistant', path: '/ai-assistant', icon: Bot, badge: 'AI' },
];

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuth();
  const { sidebarCollapsed, setSidebarCollapsed } = useCase();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen glass-panel border-r border-slate-800 transition-all duration-300 flex flex-col ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-cyan-glow flex-shrink-0">
              <Shield className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-base font-bold text-slate-100 tracking-tight font-sans flex items-center gap-1.5">
                  Crime<span className="text-cyan-400">Vision</span>
                </h1>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block -mt-0.5">
                  CITIZEN COMPLAINT PORTAL
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/30 font-semibold shadow-cyan-glow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`
                }
              >
                <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110`} />
                {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
                {!sidebarCollapsed && item.badge && (
                  <span className="ml-auto text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom User Profile */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/80">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} p-2 rounded-xl bg-slate-950/60 border border-slate-800/80`}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-xs ring-1 ring-cyan-500/40 flex-shrink-0">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Citizen User'}</p>
                <p className="text-[10px] text-slate-400 font-mono truncate">{user?.email || 'User Account'}</p>
              </div>
            )}
            {!sidebarCollapsed && (
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
