import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Dashboard = () => {
  const { currentDay, isDayComplete, getJournalEntry } = useAppContext();
  
  // Generate 84 days grouped by weeks (12 weeks x 7 days)
  const weeks = [];
  for (let week = 0; week < 12; week++) {
    const weekDays = [];
    for (let day = 0; day < 7; day++) {
      const dayNumber = week * 7 + day + 1;
      weekDays.push(dayNumber);
    }
    weeks.push(weekDays);
  }

  const getDayStatus = (day) => {
    const isComplete = isDayComplete(day);
    const isCurrent = day === currentDay;
    const isFuture = day > currentDay;
    const hasReflection = getJournalEntry(day.toString()).trim().length > 0;
    
    return {
      isComplete,
      isCurrent,
      isFuture,
      hasReflection,
    };
  };

  const getDayStyles = (day) => {
    const { isComplete, isCurrent, isFuture, hasReflection } = getDayStatus(day);
    
    let baseStyles = "w-8 h-8 md:w-10 md:h-10 rounded-md flex items-center justify-center text-xs md:text-sm font-mono transition-all duration-200 border md:border-2 touch-manipulation";
    
    if (isFuture) {
      return `${baseStyles} bg-background text-accent/60 border-accent/20 cursor-not-allowed`;
    } else if (isCurrent) {
      return `${baseStyles} bg-primary text-white border-primary shadow-md ring-1 md:ring-2 ring-primary/30`;
    } else if (isComplete) {
      return `${baseStyles} bg-accent text-white border-accent hover:bg-accent/80`;
    } else {
      return `${baseStyles} bg-white text-primary border-accent/30 hover:border-primary hover:shadow-sm`;
    }
  };

  const getReflectionEmoji = (day) => {
    const { hasReflection } = getDayStatus(day);
    if (hasReflection) {
      return '✍️';
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-background text-primary font-serif">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Your Journey</h1>
          <p className="text-accent text-sm md:text-base">Track your progress through 84 days of ascetic practice</p>
        </div>
        
        {/* Legend */}
        <div className="mb-6 md:mb-8 flex flex-wrap gap-2 md:gap-4 justify-center text-xs md:text-sm bg-white rounded-lg p-3 md:p-4 shadow-sm border border-accent/20">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary"></div>
            <span>Current Day</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-accent"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-white border border-accent/30"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-background"></div>
            <span>Future</span>
          </div>
          <div className="flex items-center gap-2">
            <span>✍️</span>
            <span>Has Reflection</span>
          </div>
        </div>

        {/* 84-Day Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {weeks.map((weekDays, weekIndex) => (
            <div key={weekIndex} className="bg-white rounded-lg shadow-sm p-3 md:p-4 border border-accent/20">
              <h3 className="text-xs md:text-sm font-semibold text-accent mb-2 md:mb-3 text-center">
                Week {weekIndex + 1}
              </h3>
              <div className="grid grid-cols-7 gap-0.5 md:gap-1">
                {weekDays.map((day) => {
                  const { isFuture } = getDayStatus(day);
                  const emoji = getReflectionEmoji(day);
                  
                  if (isFuture) {
                    return (
                      <div
                        key={day}
                        className={getDayStyles(day)}
                        title={`Day ${day} - Not yet available`}
                      >
                        {day}
                      </div>
                    );
                  }
                  
                  return (
                    <Link
                      key={day}
                      to={`/day/${day}`}
                      className={getDayStyles(day)}
                      title={`Day ${day}${emoji ? ' - Has reflection' : ''}`}
                    >
                      <div className="relative">
                        {day}
                        {emoji && (
                          <div className="absolute -top-1 -right-1 text-xs">
                            {emoji}
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Current Progress Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 text-center border border-accent/20">
          <h2 className="text-xl font-bold mb-4 text-primary">Your Progress</h2>
          <div className="flex justify-center gap-8 text-sm">
            <div>
              <div className="text-2xl font-bold text-primary">{currentDay}</div>
              <div className="text-accent">Current Day</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {Array.from({length: 84}, (_, i) => i + 1).filter(day => isDayComplete(day)).length}
              </div>
              <div className="text-accent">Days Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {Array.from({length: 84}, (_, i) => i + 1).filter(day => getJournalEntry(day.toString()).trim().length > 0).length}
              </div>
              <div className="text-accent">Reflections Written</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard; 