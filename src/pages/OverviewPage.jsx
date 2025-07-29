import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { layersByWeek } from '../data/layersByWeek';
import { useAppContext } from '../context/AppContext';

const OverviewPage = () => {
  const navigate = useNavigate();
  const { currentDay, isDayAvailable, hasStarted, startJourney, isDayComplete, state } = useAppContext();
  const [completedDays, setCompletedDays] = useState([]);

  // Load completedDays from AppContext (Supabase data)
  useEffect(() => {
    const completed = [];
    
    for (let day = 1; day <= 84; day++) {
      if (isDayComplete(day)) {
        completed.push(day);
      }
    }
    
    setCompletedDays(completed);
  }, [isDayComplete, state.journalEntries, state.completedDays]); // Re-run when journal entries or completed days change

  // Calculate progress
  const progressPercentage = Math.round((completedDays.length / 84) * 100);

  // Get day styles
  const getDayStyles = (dayNumber) => {
    const isCompleted = completedDays.includes(dayNumber);
    const isToday = dayNumber === currentDay;
    const isAvailable = isDayAvailable(dayNumber);
    
    let styles = "aspect-square flex items-center justify-center rounded-md text-xs md:text-sm font-medium transition-all duration-200 touch-manipulation ";
    
    if (!isAvailable) {
      styles += "bg-gray-100 text-gray-400 border md:border-2 border-gray-200 cursor-not-allowed opacity-60";
    } else if (isCompleted) {
      styles += "bg-accent/20 text-accent border md:border-2 border-accent/30 hover:bg-accent/30 cursor-pointer hover:scale-105";
    } else if (isToday) {
      styles += "bg-primary/20 text-primary border md:border-2 border-primary ring-1 md:ring-2 ring-primary/30 hover:bg-primary/30 cursor-pointer hover:scale-105";
    } else {
      styles += "bg-white text-accent border md:border-2 border-accent/20 hover:bg-background cursor-pointer hover:scale-105";
    }
    
    return styles;
  };

  // Handle day click
  const handleDayClick = (dayNumber) => {
    if (isDayAvailable(dayNumber)) {
      navigate(`/day/${dayNumber}`);
    }
  };

  // Generate 12 weeks of 7 days each
  const weeks = Array.from({ length: 12 }, (_, weekIndex) => {
    const startDay = weekIndex * 7 + 1;
    return Array.from({ length: 7 }, (_, dayIndex) => startDay + dayIndex);
  });

  return (
    <div className="min-h-screen bg-background font-serif text-primary">
      {/* Header */}
      <div className="bg-white border-b border-accent/20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 md:px-6 md:py-6">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-light text-primary">Overview</h1>
            <p className="text-accent mt-1 text-sm md:text-base">84 days of ascetic practice</p>
            {hasStarted && (
              <div>
                <p className="text-accent/80 text-sm mt-2">
                  Day {currentDay} • {84 - currentDay + 1} days remaining
                </p>
              </div>
            )}
            {!hasStarted && (
              <div className="mt-4">
                <p className="text-accent mb-3">Ready to begin your journey?</p>
                <button
                  onClick={() => navigate('/day/1')}
                  className="bg-primary text-white px-6 py-2 rounded-md hover:bg-accent transition-colors font-medium"
                >
                  Start Day 1
                </button>
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-accent">Progress</span>
              <span className="text-sm font-medium text-accent">
                {completedDays.length}/84 days ({progressPercentage}% complete)
              </span>
            </div>
            <div className="w-full bg-accent/20 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-accent to-primary h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 12 × 7 Grid */}
      <div className="max-w-6xl mx-auto px-4 py-6 md:px-6 md:py-8">
        <div className="space-y-4 md:space-y-6">
          {weeks.map((week, weekIndex) => {
            const weekNumber = weekIndex + 1;
            const weekLayer = layersByWeek[weekNumber];
            
            return (
              <div key={weekIndex} className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-accent/20">
                {/* Week Header */}
                <div className="mb-3 md:mb-4">
                  <h3 className="text-base md:text-lg font-semibold text-primary">
                    Week {weekNumber}: {weekLayer?.title}
                  </h3>
                  <p className="text-xs md:text-sm text-accent mt-1">
                    {weekLayer?.description}
                  </p>
                </div>
                
                {/* Week Grid - 7 days */}
                <div className="grid grid-cols-7 gap-1 md:gap-2">
                  {week.map((dayNumber) => {
                    const isCompleted = completedDays.includes(dayNumber);
                    const isToday = dayNumber === currentDay;
                    const isAvailable = isDayAvailable(dayNumber);
                    
                    return (
                      <div
                        key={dayNumber}
                        onClick={() => handleDayClick(dayNumber)}
                        className={getDayStyles(dayNumber)}
                      >
                        <div className="text-center">
                          <div className="font-semibold text-xs md:text-sm">{dayNumber}</div>
                          {!isAvailable && (
                            <div className="text-xs mt-0.5">🔒</div>
                          )}
                          {isCompleted && isAvailable && (
                            <div className="text-xs mt-0.5">✓</div>
                          )}
                          {isToday && isAvailable && (
                            <div className="text-xs mt-0.5">●</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 md:mt-8 bg-white rounded-lg shadow-sm p-4 md:p-6 border border-accent/20">
          <h3 className="text-base md:text-lg font-medium text-primary mb-3 md:mb-4">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-accent/20 border md:border-2 border-accent/30 rounded-md flex items-center justify-center">
                <span className="text-accent text-xs">✓</span>
              </div>
              <span className="text-xs md:text-sm text-accent">Completed</span>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-primary/20 border md:border-2 border-primary rounded-md flex items-center justify-center">
                <span className="text-primary text-xs">●</span>
              </div>
              <span className="text-xs md:text-sm text-accent">Current</span>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-white border md:border-2 border-accent/20 rounded-md"></div>
              <span className="text-xs md:text-sm text-accent">Available</span>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-100 border md:border-2 border-gray-200 rounded-md flex items-center justify-center opacity-60">
                <span className="text-gray-400 text-xs">🔒</span>
              </div>
              <span className="text-xs md:text-sm text-accent">Locked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage; 