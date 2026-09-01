import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CaseProvider } from './context/CaseContext';

// Layout
import AppLayout from './components/layout/AppLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// User Portal Pages
import DashboardPage from './pages/DashboardPage';
import CasesPage from './pages/CasesPage';
import CreateCasePage from './pages/CreateCasePage';
import CaseDetailPage from './pages/CaseDetailPage';
import EvidenceListPage from './pages/EvidenceListPage';
import EvidenceUploadPage from './pages/EvidenceUploadPage';
import EvidenceDetailPage from './pages/EvidenceDetailPage';
import AIAssistantPage from './pages/AIAssistantPage';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Public Route Guard (Redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <CaseProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />

            {/* Protected User Dashboard Routes */}
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

              {/* Complaints & Cases */}
              <Route path="cases" element={<CasesPage />} />
              <Route path="cases/new" element={<CreateCasePage />} />
              <Route path="cases/:caseId" element={<CaseDetailPage />} />

              {/* Evidence */}
              <Route path="evidence" element={<EvidenceListPage />} />
              <Route path="evidence/upload" element={<EvidenceUploadPage />} />
              <Route path="evidence/:evidenceId" element={<EvidenceDetailPage />} />

              {/* AI Cyber Safety Assistant */}
              <Route path="ai-assistant" element={<AIAssistantPage />} />

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
