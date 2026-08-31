import React, { createContext, useContext, useState, useEffect } from 'react';
import { casesApi, evidenceApi, statsApi } from '../services/api';

const CaseContext = createContext(null);

export const CaseProvider = ({ children }) => {
  const [cases, setCases] = useState([]);
  const [evidenceList, setEvidenceList] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingCases, setLoadingCases] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const refreshCases = async () => {
    setLoadingCases(true);
    try {
      const data = await casesApi.getCases();
      setCases(data);
    } catch (err) {
      console.error('Failed to fetch cases', err);
    } finally {
      setLoadingCases(false);
    }
  };

  const refreshEvidence = async () => {
    try {
      const data = await evidenceApi.getEvidence();
      setEvidenceList(data);
    } catch (err) {
      console.error('Failed to fetch evidence', err);
    }
  };

  const refreshStats = async () => {
    try {
      const [s, n] = await Promise.all([statsApi.getStats(), statsApi.getNotifications()]);
      setStats(s);
      setNotifications(n);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  useEffect(() => {
    refreshCases();
    refreshEvidence();
    refreshStats();
  }, []);

  const addCase = async (caseData) => {
    const created = await casesApi.createCase(caseData);
    setCases(prev => [created, ...prev]);
    showToast(`Case ${created.id} created successfully!`, 'success');
    return created;
  };

  const addEvidence = async (fileData, onProgress) => {
    const created = await evidenceApi.uploadEvidence(fileData, onProgress);
    setEvidenceList(prev => [created, ...prev]);
    refreshCases();
    showToast(`Evidence ${created.fileName} uploaded & analyzed!`, 'success');
    return created;
  };

  return (
    <CaseContext.Provider value={{
      cases,
      evidenceList,
      notifications,
      stats,
      loadingCases,
      isSearchOpen,
      setIsSearchOpen,
      sidebarCollapsed,
      setSidebarCollapsed,
      toast,
      showToast,
      refreshCases,
      refreshEvidence,
      addCase,
      addEvidence
    }}>
      {children}
    </CaseContext.Provider>
  );
};

export const useCase = () => {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCase must be used within a CaseProvider');
  }
  return context;
};
