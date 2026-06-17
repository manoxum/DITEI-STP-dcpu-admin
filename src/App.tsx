/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AdminLayout } from './components/AdminLayout';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/views/DashboardView';
import { ProcessesView } from './components/views/ProcessesView';
import { DelimitationView } from './components/views/DelimitationView';
import { OwnersView } from './components/views/OwnersView';
import { OwnerDetailsView } from './components/views/OwnerDetailsView';
import { HomeView } from './components/views/HomeView';
import { LandingView } from './components/views/LandingView';
import { ServicesView } from './components/views/ServicesView';
import { TitlesView } from './components/views/TitlesView';
import { TitleDetailsView } from './components/views/TitleDetailsView';
import { StaffView } from './components/views/StaffView';
import { ReportsView } from './components/views/SimpleViews';
import { AdminSection } from './types';

import { ValidateTitleView } from './components/views/ValidateTitleView';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  // Public route: Landing Page
  if (location.pathname === '/' && !isLoggedIn) {
    return <LandingView />;
  }

  // Public route: Validate Title
  if (location.pathname.startsWith('/validate/')) {
    return (
      <Routes>
        <Route path="/validate/:id" element={<ValidateTitleView />} />
      </Routes>
    );
  }

  if (location.pathname === '/login') {
    if (isLoggedIn) return <Navigate to="/dashboard" replace />;
    return <LoginView onLogin={handleLogin} />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AdminLayout onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<HomeView onEnter={() => navigate('/dashboard')} />} />
        <Route path="/dashboard" element={<DashboardView />} />
        <Route path="/services" element={<ServicesView />} />
        <Route path="/processes" element={<ProcessesView />} />
        <Route path="/delimitation" element={<DelimitationView />} />
        <Route path="/titles" element={<TitlesView />} />
        <Route path="/titles/:id" element={<TitleDetailsView />} />
        <Route path="/owners" element={<OwnersView />} />
        <Route path="/owners/:id" element={<OwnerDetailsView />} />
        <Route path="/staff" element={<StaffView />} />
        <Route path="/reports" element={<ReportsView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminLayout>
  );
}
