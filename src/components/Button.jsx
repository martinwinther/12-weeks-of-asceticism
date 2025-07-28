import React from 'react';

const Button = ({ children, onClick, className = '', ...props }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button; 