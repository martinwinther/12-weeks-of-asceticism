import React from 'react';
import { useTheme } from '../context/ThemeContext';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl border border-accent/20 max-w-sm w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-center p-6 border-b border-accent/10">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary">Sign Out</h3>
            <p className="text-sm text-accent">Are you sure you want to sign out?</p>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-accent mb-6">
            You'll need to sign in again to access your journal entries and progress.
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex border-t border-accent/10">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-sm font-medium text-accent hover:text-primary hover:bg-background transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal; 