import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import OverviewPage from './pages/OverviewPage';
import TimelinePage from './pages/TimelinePage';
import DayPage from './pages/DayPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/day/:dayNumber" element={<DayPage />} />
        <Route path="/week01" element={<Week01 />} />
        <Route path="/week02" element={<Week02 />} />
        {/* <Route path="/week02" element={<Week02 />} /> ... */}
        <Route path="/week12" element={<Week12 />} />
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
