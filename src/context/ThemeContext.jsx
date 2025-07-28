import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('ascetic-theme');
    if (savedTheme && ['light', 'dark', 'monastic'].includes(savedTheme)) {
      setThemeState(savedTheme);
    }
  }, []);

  // Save theme to localStorage when it changes
  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('ascetic-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 