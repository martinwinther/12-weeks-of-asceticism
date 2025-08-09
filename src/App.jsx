import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import PrivateRoute from './components/PrivateRoute';
import CookieConsent from './components/CookieConsent';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import OverviewPage from './pages/OverviewPage';
import TimelinePage from './pages/TimelinePage';
import DayPage from './pages/DayPage';
import AuthPage from './pages/AuthPage';
import PrivacyPage from './pages/PrivacyPage';
import AccountSettingsPage from './pages/AccountSettingsPage';

const AppContent = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const showNavigation = location.pathname !== '/' && location.pathname !== '/auth' && location.pathname !== '/privacy';

  return (
    <div className={`theme-${theme} min-h-screen transition-colors duration-300`}>
      {showNavigation && <Navigation />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        {/* Redirect old auth routes to new unified auth page */}
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/signup" element={<Navigate to="/auth" replace />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/overview" element={
          <PrivateRoute>
            <OverviewPage />
          </PrivateRoute>
        } />
        <Route path="/timeline" element={
          <PrivateRoute>
            <TimelinePage />
          </PrivateRoute>
        } />
        <Route path="/day/:dayNumber" element={
          <PrivateRoute>
            <DayPage />
          </PrivateRoute>
        } />
        <Route path="/account" element={
          <PrivateRoute>
            <AccountSettingsPage />
          </PrivateRoute>
        } />
      </Routes>
      <CookieConsent />
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
