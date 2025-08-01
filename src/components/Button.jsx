import React from 'react';

const Button = ({ children, onClick, className = '', ...props }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 bg-primary text-primary rounded-lg font-medium hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button; 