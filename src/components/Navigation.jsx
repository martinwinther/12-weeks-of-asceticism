import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/overview', label: 'Overview' },
    { path: '/timeline', label: 'Timeline' },
  ];

  return (
    <nav className="bg-white border-b border-accent/20 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link to="/" className="text-lg md:text-xl font-bold text-primary font-serif">
            <span className="hidden sm:inline">12 Weeks of Asceticism</span>
            <span className="sm:hidden">Asceticism</span>
          </Link>
          
          <div className="flex space-x-2 md:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-2 py-2 md:px-3 rounded-md text-xs md:text-sm font-medium transition-colors touch-manipulation ${
                  location.pathname === item.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-accent hover:text-primary hover:bg-background'
                }`}
              >
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">
                  {item.label === 'Dashboard' ? 'Home' : 
                   item.label === 'Overview' ? 'Grid' :
                   item.label === 'Timeline' ? 'Log' : item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 