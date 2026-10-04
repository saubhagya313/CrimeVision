import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  Search,
  FileText,
  FolderLock,
  MapPin,
  Users,
  BarChart3,
  ScrollText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCase } from '../../context/CaseContext';

// Citizen / User Navigation Items
const citizenNavItems = [
  { name: 'User Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Analyze Evidence', path: '/analyze', icon: Search, badge: 'OCR + AI' },
  { name: 'Generate Complaint', path: '/complaint-generator', icon: FileText, badge: 'Draft' },
  { name: 'My Analyses & Drafts', path: '/my-analyses', icon: FolderLock },
  { name: 'Find Police Station', path: '/nearby-police', icon: MapPin },
];

// Admin Application Management Navigation Items (NOT a police officer portal)
const adminNavItems = [
  { name: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'User Management', path: '/admin/users', icon: Users, badge: 'Users' },
  { name: 'Analysis Monitoring', path: '/admin/analyses', icon: BarChart3 },
  { name: 'Complaint Monitoring', path: '/admin/complaints', icon: FileText },
  { name: 'System Audit Logs', path: '/admin/audit-logs', icon: ScrollText },
  { name: 'System Settings', path: '/admin/settings', icon: Settings },
];

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuth();
  const { sidebarCollapsed, setSidebarCollapsed } = useCase();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'Admin';
  const navItems = isAdmin ? adminNavItems : citizenNavItems;

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
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/70">
          <div className="flex items-center gap-3 overflow-hidden">
            <div
              className={`p-2 rounded-xl flex-shrink-0 ${
                isAdmin
                  ? 'bg-gradient-to-tr from-amber-500 to-indigo-600 shadow-md'
                  : 'bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-cyan-glow'
              }`}
            >
              <Shield className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-base font-bold text-slate-100 tracking-tight font-sans flex items-center gap-1.5">
                  Crime<span className={isAdmin ? 'text-amber-400' : 'text-cyan-400'}>Vision</span>
                </h1>
                <span
                  className={`text-[9px] font-mono uppercase tracking-wider block -mt-0.5 font-bold ${
                    isAdmin ? 'text-amber-400' : 'text-cyan-400'
                  }`}
                >
                  {isAdmin ? 'APPLICATION ADMIN' : 'CITIZEN ASSISTANCE'}
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
        <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
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
                      ? isAdmin
                        ? 'bg-gradient-to-r from-amber-500/20 to-indigo-500/10 text-amber-400 border border-amber-500/30 font-semibold'
                        : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/30 font-semibold shadow-cyan-glow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`
                }
              >
                <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110`} />
                {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
                {!sidebarCollapsed && item.badge && (
                  <span
                    className={`ml-auto text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isAdmin
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Citizen Emergency Quick Tip */}
        {!sidebarCollapsed && !isAdmin && (
          <div className="mx-3 mb-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/90 text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px] mb-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Cyber Emergency?</span>
            </div>
            <p className="text-slate-400 text-[10px] leading-relaxed">
              Dial <span className="text-cyan-400 font-bold">1930</span> or visit <span className="text-cyan-400 font-medium">cybercrime.gov.in</span> immediately.
            </p>
          </div>
        )}

        {/* Bottom User Profile */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/80">
          <div
            className={`flex items-center ${
              sidebarCollapsed ? 'justify-center' : 'gap-3'
            } p-2 rounded-xl bg-slate-950/60 border border-slate-800/80`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-slate-950 font-black text-xs ring-1 flex-shrink-0 ${
                isAdmin
                  ? 'bg-gradient-to-tr from-amber-400 to-indigo-500 ring-amber-400/40'
                  : 'bg-gradient-to-tr from-cyan-500 to-blue-600 ring-cyan-500/40'
              }`}
            >
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'User'}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isAdmin ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    }`}
                  >
                    {isAdmin ? 'ADMINISTRATOR' : 'CITIZEN'}
                  </span>
                </div>
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
