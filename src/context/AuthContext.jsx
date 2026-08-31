import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';
import { MOCK_USER } from '../services/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('crimevision_user');
    return saved ? JSON.parse(saved) : MOCK_USER; // Default logged in for seamless demo UX
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('crimevision_token');
    return !!token || true; // Default true for instant exploration
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('crimevision_user', JSON.stringify(user));
      localStorage.setItem('crimevision_token', 'mock-jwt-token-crimevision-2026');
    } else {
      localStorage.removeItem('crimevision_user');
      localStorage.removeItem('crimevision_token');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authApi.login(email, password);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authApi.register(userData);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('crimevision_user');
    localStorage.removeItem('crimevision_token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
