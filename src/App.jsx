import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import DayPage from './pages/DayPage';
import Week01 from './pages/Week01';
import Week12 from './pages/Week12';
import Week02 from './pages/Week02';
// ... import Week02 to Week11 when created

const App = () => (
  <AppProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/day/:day" element={<DayPage />} />
        <Route path="/week01" element={<Week01 />} />
        <Route path="/week02" element={<Week02 />} />
        {/* <Route path="/week02" element={<Week02 />} /> ... */}
        <Route path="/week12" element={<Week12 />} />
      </Routes>
    </BrowserRouter>
  </AppProvider>
);

export default App;
