import React from 'react';

const Button = ({ children, onClick, type = 'button', className = '' }) => (
  <button
    type={type}
    onClick={onClick}
    className={`px-6 py-2 rounded bg-primary text-background font-mono hover:bg-accent transition ${className}`}
  >
    {children}
  </button>
);

export default Button; 