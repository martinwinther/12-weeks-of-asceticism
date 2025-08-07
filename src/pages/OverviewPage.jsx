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
    
    if (!isAvailable) {
      styles += "bg-background text-accent/60 border-accent/20 cursor-not-allowed";
    } else if (completionStatus.isFullyComplete) {
      // Fully complete: all practices + journal
      styles += "bg-accent text-white border-accent hover:bg-accent/80";
    } else if (isToday) {
      // Today but not started
      styles += "bg-primary text-white border-primary shadow-md ring-1 md:ring-2 ring-primary/30";
    } else {
      // Available but not complete
      styles += "bg-surface text-primary border-accent/30 hover:border-primary hover:shadow-sm";
    }
    
    return { styles, completionStatus };
  };

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

  // Check if a week is completed (all 7 days are complete)
  const isWeekCompleted = (weekDays) => {
    return weekDays.every(day => isDayComplete(day));
  };

  // Get week container styles
  const getWeekContainerStyles = (weekDays, weekIndex) => {
    const isCompleted = isWeekCompleted(weekDays);
    const baseStyles = "bg-surface rounded-lg shadow-sm p-3 md:p-4 border border-accent/20";
    
    if (isCompleted) {
      return `${baseStyles} border-2 border-primary shadow-md`;
    }
    
    return baseStyles;
  };

  const handleDayClick = (dayNumber) => {
    if (isDayAvailable(dayNumber)) {
      navigate(`/day/${dayNumber}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary font-serif">
      {/* Header */}
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

      {/* 12 × 7 Grid */}
      <div className="max-w-6xl mx-auto px-4 py-6 md:px-6 md:py-8">
        <div className="space-y-4 md:space-y-6">
          {weeks.map((weekDays, weekIndex) => {
            const weekNumber = weekIndex + 1;
            const weekLayer = layersByWeek[weekNumber];
            const isCompleted = isWeekCompleted(weekDays);
            
            return (
              <div key={weekIndex} className={getWeekContainerStyles(weekDays, weekIndex)}>
                {/* Week Header */}
                <div className="mb-3 md:mb-4">
                  <h3 className={`text-base md:text-lg font-semibold mb-1
                    ${isCompleted ? 'text-primary' : 'text-primary'}`}>
                    Week {weekNumber}: {weekLayer?.title}
                  </h3>
                  <p className="text-xs md:text-sm text-accent">
                    {weekLayer?.description}
                  </p>
                </div>
                
                {/* Week Grid - 7 days */}
                <div className="grid grid-cols-7 gap-1 md:gap-2">
                  {weekDays.map((dayNumber) => {
                    const { styles, completionStatus } = getDayInfo(dayNumber);
                    const hasReflection = completionStatus.hasJournal;
                    
                    return (
                      <div
                        key={dayNumber}
                        onClick={() => handleDayClick(dayNumber)}
                        className={styles}
                        title={`Day ${dayNumber}${hasReflection ? ' - Has reflection' : ''}`}
                      >
                        <div className="relative w-full h-full flex items-center justify-center">
                          {dayNumber}
                          {hasReflection && (
                            <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white/80 rounded-full shadow-sm"></div>
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
      </div>
    </div>
  );
};

export default OverviewPage; 