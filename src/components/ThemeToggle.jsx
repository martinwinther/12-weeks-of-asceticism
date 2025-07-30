import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { 
      id: 'light', 
      name: 'Light', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    { 
      id: 'dark', 
      name: 'Dark', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )
    },
    { 
      id: 'monastic', 
      name: 'Monastic', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
  ];

  return (
    <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-sm border border-accent/20">
      {themes.map((themeOption) => (
        <button
          key={themeOption.id}
          onClick={() => setTheme(themeOption.id)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
            theme === themeOption.id
              ? 'bg-primary text-white shadow-sm'
              : 'text-accent hover:text-primary hover:bg-background'
          }`}
          aria-label={`Switch to ${themeOption.name} theme`}
        >
          {themeOption.icon}
          <span className="hidden sm:inline">{themeOption.name}</span>
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle; 