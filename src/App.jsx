import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import OverviewPage from './pages/OverviewPage';
import TimelinePage from './pages/TimelinePage';
import DayPage from './pages/DayPage';
import AuthPage from './pages/AuthPage';
import Week01 from './pages/Week01';
import Week12 from './pages/Week12';
import Week02 from './pages/Week02';
// ... import Week02 to Week11 when created

const AppContent = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const showNavigation = location.pathname !== '/';

  return (
    <div className={`theme-${theme} min-h-screen transition-colors duration-300`}>
      {showNavigation && <Navigation />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
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
        <Route path="/week01" element={
          <PrivateRoute>
            <Week01 />
          </PrivateRoute>
        } />
        <Route path="/week02" element={
          <PrivateRoute>
            <Week02 />
          </PrivateRoute>
        } />
        <Route path="/week12" element={
          <PrivateRoute>
            <Week12 />
          </PrivateRoute>
        } />
      </Routes>
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
