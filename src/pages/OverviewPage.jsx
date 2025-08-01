import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { layersByWeek } from '../data/layersByWeek';
import { useAppContext } from '../context/AppContext';

const OverviewPage = () => {
  const navigate = useNavigate();
  const { currentDay, isDayAvailable, hasStarted, startJourney, isDayComplete, getDayCompletionStatus, state } = useAppContext();
  const [completedDays, setCompletedDays] = useState([]);

  // Load completion data from AppContext (Supabase data)
  useEffect(() => {
    const completed = [];
    
    for (let day = 1; day <= 84; day++) {
      if (isDayComplete(day)) {
        completed.push(day);
      }
    }
    
    setCompletedDays(completed);
  }, [isDayComplete, state.journalEntries, state.completedDays, state.practiceCompletions]); // Re-run when completion data changes

  // Calculate progress
  const progressPercentage = Math.round((completedDays.length / 84) * 100);

  // Get completion status and styles for a day
  const getDayInfo = (dayNumber) => {
    const isToday = dayNumber === currentDay;
    const isAvailable = isDayAvailable(dayNumber);
    const completionStatus = getDayCompletionStatus(dayNumber);
    
    let styles = "aspect-square flex items-center justify-center rounded-md text-xs md:text-sm font-medium transition-all duration-200 touch-manipulation ";
    let icon = null;
    let bgClass = "";
    
    if (!isAvailable) {
      styles += "bg-muted/20 text-muted border md:border-2 border-muted/30 cursor-not-allowed opacity-60";
      icon = "🔒";
    } else if (completionStatus.isFullyComplete) {
      // Fully complete: all practices + journal
      styles += "bg-primary/10 text-primary border md:border-2 border-primary/60 hover:bg-primary/20 cursor-pointer hover:scale-105";
      icon = "✅";
    } else if (completionStatus.practicesCompleted > 0 && completionStatus.hasJournal) {
      // Partial practices + journal
      styles += "bg-accent/10 text-accent border md:border-2 border-accent/60 hover:bg-accent/20 cursor-pointer hover:scale-105";
      icon = "📝";
    } else if (completionStatus.practicesCompleted === completionStatus.practicesTotal && !completionStatus.hasJournal) {
      // All practices but no journal
      styles += "bg-primary/5 text-primary/80 border md:border-2 border-primary/40 hover:bg-primary/10 cursor-pointer hover:scale-105";
      icon = "🏃";
    } else if (completionStatus.practicesCompleted > 0 || completionStatus.hasJournal) {
      // Some progress
      styles += "bg-accent/5 text-accent/80 border md:border-2 border-accent/40 hover:bg-accent/10 cursor-pointer hover:scale-105";
      icon = "⏸️";
    } else if (isToday) {
      // Today but not started
      styles += "bg-primary/20 text-primary border md:border-2 border-primary ring-1 md:ring-2 ring-primary/30 hover:bg-primary/30 cursor-pointer hover:scale-105";
      icon = "●";
    } else {
      // Available but not started
      styles += "bg-white text-accent border md:border-2 border-accent/20 hover:bg-background cursor-pointer hover:scale-105";
      icon = null;
    }
    
    return { styles, icon, completionStatus };
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
                    const { styles, icon, completionStatus } = getDayInfo(dayNumber);
                    
                    return (
                      <div
                        key={dayNumber}
                        onClick={() => handleDayClick(dayNumber)}
                        className={styles}
                        title={`Day ${dayNumber} - Practices: ${completionStatus.practicesCompleted}/${completionStatus.practicesTotal}, Journal: ${completionStatus.hasJournal ? 'Complete' : 'Incomplete'}`}
                      >
                        <div className="text-center">
                          <div className="font-semibold text-xs md:text-sm">{dayNumber}</div>
                          {icon && (
                            <div className="text-xs mt-0.5">{icon}</div>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-primary/10 border md:border-2 border-primary/60 rounded-md flex items-center justify-center">
                <span className="text-primary text-xs">✅</span>
              </div>
              <span className="text-xs md:text-sm text-accent">Complete</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-primary/5 border md:border-2 border-primary/40 rounded-md flex items-center justify-center">
                <span className="text-primary/80 text-xs">🏃</span>
              </div>
              <span className="text-xs md:text-sm text-accent">Practices Only</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-accent/10 border md:border-2 border-accent/60 rounded-md flex items-center justify-center">
                <span className="text-accent text-xs">📝</span>
              </div>
              <span className="text-xs md:text-sm text-accent">Partial + Journal</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-accent/5 border md:border-2 border-accent/40 rounded-md flex items-center justify-center">
                <span className="text-accent/80 text-xs">⏸️</span>
              </div>
              <span className="text-xs md:text-sm text-accent">In Progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-primary/20 border md:border-2 border-primary rounded-md flex items-center justify-center">
                <span className="text-primary text-xs">●</span>
              </div>
              <span className="text-xs md:text-sm text-accent">Today</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-muted/20 border md:border-2 border-muted/30 rounded-md flex items-center justify-center opacity-60">
                <span className="text-muted text-xs">🔒</span>
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