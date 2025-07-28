import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const navItems = [
    { 
      path: '/dashboard', 
      label: 'Home',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      path: '/overview', 
      label: 'Progress',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      path: '/timeline', 
      label: 'Journal',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
  ];

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      // Use replace to prevent going back to authenticated state
      navigate('/', { replace: true });
    }
    setIsUserMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation - Clean minimal top bar */}
      <nav className="hidden md:block bg-white/80 backdrop-blur-sm border-b border-accent/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Main Navigation */}
            <div className="flex items-center space-x-1 bg-white rounded-full px-2 py-2 shadow-sm border border-accent/10">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-accent hover:text-primary hover:bg-background'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
            
            {/* Right side - User menu and Theme Toggle */}
            <div className="flex items-center space-x-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-full bg-white border border-accent/10 hover:bg-background transition-colors"
                  >
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-accent hidden sm:block">{user.email}</span>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-accent/10 py-1 z-50">
                      <div className="px-4 py-2 border-b border-accent/10">
                        <p className="text-xs text-accent/70">Signed in as</p>
                        <p className="text-sm font-medium text-accent truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-accent hover:bg-background transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-3 py-2 text-sm text-accent hover:text-primary transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-sm bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              )}
              
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-accent/10 z-50 safe-area-pb">
        <div className="px-2 py-2">
          {/* Main Navigation Tabs */}
          <div className="flex items-center justify-around mb-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-200 touch-manipulation min-w-0 flex-1 ${
                  location.pathname === item.path
                    ? 'text-primary bg-primary/10'
                    : 'text-accent/70 hover:text-primary'
                }`}
              >
                <div className={`transition-transform duration-200 ${
                  location.pathname === item.path ? 'scale-110' : 'scale-100'
                }`}>
                  {item.icon}
                </div>
                <span className="text-xs font-medium truncate">{item.label}</span>
              </Link>
            ))}
          </div>
          
          {/* User menu and Theme Toggle for Mobile */}
          <div className="flex justify-between items-center px-4">
            {user ? (
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-full bg-white border border-accent/10"
              >
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-accent">{user.email}</span>
              </button>
            ) : (
              <Link
                to="/auth"
                className="px-3 py-2 text-sm bg-primary text-white rounded-full"
              >
                Sign in
              </Link>
            )}
            
            <ThemeToggle />
          </div>
          
          {/* Mobile user menu dropdown */}
          {user && isUserMenuOpen && (
            <div className="mt-2 mx-4 bg-white rounded-lg shadow-lg border border-accent/10 py-1">
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-accent"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile bottom padding spacer */}
      <div className="md:hidden h-24"></div>
    </>
  );
};

export default Navigation; 