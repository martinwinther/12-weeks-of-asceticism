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
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-mono text-xs
            ${isCompleted ? 'bg-accent border-accent text-background' : isCurrent ? 'bg-primary border-primary text-background' : 'bg-background border-accent text-accent'}`}
          title={`Week ${week}`}
        >
          {week}
        </div>
      );
    })}
  </div>
);

export default ProgressTracker; 