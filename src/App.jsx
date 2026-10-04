import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CaseProvider } from './context/CaseContext';

// Layout
import AppLayout from './components/layout/AppLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Citizen / User Pages
import DashboardPage from './pages/DashboardPage';
import AnalysisPage from './pages/AnalysisPage';
import ComplaintDraftPage from './pages/ComplaintDraftPage';
import MyAnalysesPage from './pages/MyAnalysesPage';
import NearbyPolicePage from './pages/NearbyPolicePage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminAnalysesPage from './pages/admin/AdminAnalysesPage';
import AdminComplaintsPage from './pages/admin/AdminComplaintsPage';
import AdminAuditLogsPage from './pages/admin/AdminAuditLogsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Admin-Only Route Guard
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role !== 'Admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Public Route Guard (Redirects to appropriate portal if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) {
    if (user?.role === 'Admin') {
      return <Navigate to="/admin" replace />;
    }
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

            {/* Protected Routes Container */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              {/* Default Index Route */}
              <Route index element={<Navigate to="/dashboard" replace />} />

              {/* Citizen / User Routes */}
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="analyze" element={<AnalysisPage />} />
              <Route path="complaint-generator" element={<ComplaintDraftPage />} />
              <Route path="my-analyses" element={<MyAnalysesPage />} />
              <Route path="nearby-police" element={<NearbyPolicePage />} />

              {/* Admin Management Routes */}
              <Route
                path="admin"
                element={
                  <AdminRoute>
                    <AdminDashboardPage />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/users"
                element={
                  <AdminRoute>
                    <AdminUsersPage />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/analyses"
                element={
                  <AdminRoute>
                    <AdminAnalysesPage />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/complaints"
                element={
                  <AdminRoute>
                    <AdminComplaintsPage />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/audit-logs"
                element={
                  <AdminRoute>
                    <AdminAuditLogsPage />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/settings"
                element={
                  <AdminRoute>
                    <AdminSettingsPage />
                  </AdminRoute>
                }
              />

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
