import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const Button = ({ children, onClick, className = '', variant = 'default', loading = false, loadingText = '', ...props }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'outline':
        return 'bg-transparent border border-accent text-accent hover:bg-accent/10 focus:ring-accent/50';
      case 'destructive':
        return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/50 border border-red-600';
      case 'secondary':
        return 'bg-accent text-white hover:bg-accent/80 focus:ring-accent/50';
      default:
        return 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/50';
    }
  };

  const getSpinnerVariant = () => {
    switch (variant) {
      case 'outline':
      case 'secondary':
        return 'accent';
      case 'destructive':
        return 'white';
      default:
        return 'white';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${getVariantClasses()} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner size="sm" variant={getSpinnerVariant()} className="mr-2" />
          {loadingText || children}
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button; 