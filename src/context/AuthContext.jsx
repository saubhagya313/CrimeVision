import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';
import { MOCK_USER } from '../services/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('crimevision_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('crimevision_token');
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authApi.login(email, password);
      if (response.token && response.user) {
        localStorage.setItem('crimevision_token', response.token);
        localStorage.setItem('crimevision_user', JSON.stringify(response.user));
        setUser(response.user);
        setIsAuthenticated(true);
      }
      return response;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password }) => {
    setLoading(true);
    try {
      const response = await authApi.register({ name, email, password });
      if (response.token && response.user) {
        localStorage.setItem('crimevision_token', response.token);
        localStorage.setItem('crimevision_user', JSON.stringify(response.user));
        setUser(response.user);
        setIsAuthenticated(true);
      }
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
