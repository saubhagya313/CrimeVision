import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CaseProvider } from './context/CaseContext';

// Layout
import AppLayout from './components/layout/AppLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// App Pages
import DashboardPage from './pages/DashboardPage';
import CasesPage from './pages/CasesPage';
import CreateCasePage from './pages/CreateCasePage';
import CaseDetailPage from './pages/CaseDetailPage';
import EvidenceListPage from './pages/EvidenceListPage';
import EvidenceUploadPage from './pages/EvidenceUploadPage';
import EvidenceDetailPage from './pages/EvidenceDetailPage';
import AnalysisPage from './pages/AnalysisPage';
import TimelinePage from './pages/TimelinePage';
import AIAssistantPage from './pages/AIAssistantPage';
import ReportsPage from './pages/ReportsPage';
import CreateReportPage from './pages/CreateReportPage';
import ReportDetailPage from './pages/ReportDetailPage';
import SettingsPage from './pages/SettingsPage';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <CaseProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Dashboard Protected Application Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />

              {/* Cases */}
              <Route path="cases" element={<CasesPage />} />
              <Route path="cases/new" element={<CreateCasePage />} />
              <Route path="cases/:caseId" element={<CaseDetailPage />} />

              {/* Evidence */}
              <Route path="evidence" element={<EvidenceListPage />} />
              <Route path="evidence/upload" element={<EvidenceUploadPage />} />
              <Route path="evidence/:evidenceId" element={<EvidenceDetailPage />} />

              {/* Analysis */}
              <Route path="analysis" element={<AnalysisPage />} />
              <Route path="analysis/:caseId" element={<AnalysisPage />} />

              {/* Timeline */}
              <Route path="timeline" element={<TimelinePage />} />
              <Route path="timeline/:caseId" element={<TimelinePage />} />

              {/* AI Assistant */}
              <Route path="ai-assistant" element={<AIAssistantPage />} />

              {/* Reports */}
              <Route path="reports" element={<ReportsPage />} />
              <Route path="reports/new" element={<CreateReportPage />} />
              <Route path="reports/:reportId" element={<ReportDetailPage />} />

              {/* Settings */}
              <Route path="settings" element={<SettingsPage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CaseProvider>
    </AuthProvider>
  );
}

export default App;
