import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'primary', 
  className = '',
  text = '',
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const variantClasses = {
    primary: 'border-primary border-t-transparent',
    accent: 'border-accent border-t-transparent',
    white: 'border-white border-t-transparent'
  };

  const spinner = (
    <div className={`${sizeClasses[size]} border-2 border-t-transparent rounded-full animate-spin ${variantClasses[variant]} ${className}`} />
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          {spinner}
          {text && (
            <p className="text-accent mt-4 text-sm">{text}</p>
          )}
        </div>
      </div>
    );
  }

  if (text) {
    return (
      <div className="text-center">
        {spinner}
        <p className="text-accent mt-2 text-sm">{text}</p>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
