import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import OverviewPage from './pages/OverviewPage';
import TimelinePage from './pages/TimelinePage';
import DayPage from './pages/DayPage';
import Week01 from './pages/Week01';
import Week12 from './pages/Week12';
import Week02 from './pages/Week02';
// ... import Week02 to Week11 when created

const AppContent = () => {
  const location = useLocation();
  const showNavigation = location.pathname !== '/';

  return (
    <>
      {showNavigation && <Navigation />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/day/:dayNumber" element={<DayPage />} />
        <Route path="/week01" element={<Week01 />} />
        <Route path="/week02" element={<Week02 />} />
        {/* <Route path="/week02" element={<Week02 />} /> ... */}
        <Route path="/week12" element={<Week12 />} />
      </Routes>
    </>
  );
};

const App = () => (
  <AppProvider>
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  </AppProvider>
);

export default App;
