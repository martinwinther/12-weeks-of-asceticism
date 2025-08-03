import React from 'react';

const ProgressTracker = ({ currentWeek, completedWeeks }) => (
  <div className="flex justify-center gap-2 my-6">
    {[...Array(12)].map((_, i) => {
      const week = i + 1;
      const isCompleted = completedWeeks.includes(week);
      const isCurrent = currentWeek === week;
      return (
        <div
          key={week}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-mono text-xs transition-all duration-300 relative
            ${isCompleted 
              ? 'bg-gradient-to-br from-success to-success/80 border-success text-white shadow-lg shadow-success/30 celebration-pulse' 
              : isCurrent 
                ? 'bg-accent border-accent text-white shadow-md' 
                : 'bg-surface border-accent text-muted hover:border-primary/50'
            }`}
          title={`Week ${week}${isCompleted ? ' - Completed!' : ''}`}
        >
          {week}
          {isCompleted && (
            <>
              <div className="absolute inset-0 rounded-full bg-success/20 animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-white shadow-sm"></div>
            </>
          )}
        </div>
      );
    })}
  </div>
);

export default ProgressTracker; 