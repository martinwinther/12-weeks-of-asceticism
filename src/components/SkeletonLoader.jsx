import React from 'react';

const SkeletonLoader = ({ 
  type = 'text', 
  lines = 3, 
  className = '',
  height = 'h-4',
  width = 'w-full'
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'text':
        return (
          <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, index) => (
              <div
                key={index}
                className={`${height} ${width} bg-accent/20 rounded animate-pulse`}
                style={{
                  width: index === lines - 1 ? '75%' : '100%'
                }}
              />
            ))}
          </div>
        );
      
      case 'card':
        return (
          <div className={`bg-surface rounded-lg p-4 border border-accent/20 ${className}`}>
            <div className="h-6 bg-accent/20 rounded w-3/4 mb-3 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-accent/20 rounded w-full animate-pulse" />
              <div className="h-4 bg-accent/20 rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-accent/20 rounded w-4/6 animate-pulse" />
            </div>
          </div>
        );
      
      case 'grid':
        return (
          <div className={`grid grid-cols-7 gap-2 ${className}`}>
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square bg-accent/20 rounded-md animate-pulse"
              />
            ))}
          </div>
        );
      
      case 'button':
        return (
          <div className={`${height} ${width} bg-accent/20 rounded animate-pulse ${className}`} />
        );
      
      default:
        return (
          <div className={`${height} ${width} bg-accent/20 rounded animate-pulse ${className}`} />
        );
    }
  };

  return renderSkeleton();
};

export default SkeletonLoader;
