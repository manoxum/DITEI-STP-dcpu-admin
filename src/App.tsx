/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AdminLayout } from './components/AdminLayout';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/views/DashboardView';
import { ProcessesView } from './components/views/ProcessesView';
import { DelimitationView } from './components/views/DelimitationView';
import { RecordsView } from './components/views/RecordsView';
import { HomeView } from './components/views/HomeView';
import { ServicesView } from './components/views/ServicesView';
import { TitlesView } from './components/views/TitlesView';
import { StaffView, ReportsView } from './components/views/SimpleViews';
import { AdminSection } from './types';

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/login');
  };

  if (!isLoggedIn && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  if (isLoggedIn && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  if (location.pathname === '/login') {
    return <LoginView onLogin={handleLogin} theme={theme} setTheme={setTheme} />;
  }

  return (
    <AdminLayout 
      onLogout={handleLogout}
      theme={theme}
      setTheme={setTheme}
    >
      <Routes>
        <Route path="/" element={<HomeView onEnter={() => navigate('/dashboard')} />} />
        <Route path="/dashboard" element={<DashboardView />} />
        <Route path="/services" element={<ServicesView />} />
        <Route path="/processes" element={<ProcessesView />} />
        <Route path="/delimitation" element={<DelimitationView />} />
        <Route path="/titles" element={<TitlesView />} />
        <Route path="/records" element={<RecordsView />} />
        <Route path="/staff" element={<StaffView />} />
        <Route path="/reports" element={<ReportsView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminLayout>
  );
}

