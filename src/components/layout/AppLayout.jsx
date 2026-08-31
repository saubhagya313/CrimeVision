import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import GlobalSearchModal from '../common/GlobalSearchModal';
import Toast from '../common/Toast';
import { useCase } from '../../context/CaseContext';

const AppLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { sidebarCollapsed } = useCase();

  return (
    <div className="min-h-screen bg-cyber-950 text-slate-200 flex flex-col font-sans antialiased cyber-grid-bg">
      {/* Sidebar */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Container */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* Top Header */}
        <TopNavbar onOpenMobileMenu={() => setIsMobileOpen(true)} />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </main>
      </div>

      {/* Global Utilities */}
      <GlobalSearchModal />
      <Toast />
    </div>
  );
};

export default AppLayout;
