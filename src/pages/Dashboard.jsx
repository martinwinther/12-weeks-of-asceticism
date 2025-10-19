import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import CompletionModal from '../components/CompletionModal';

const Dashboard = () => {
  const { currentDay, isDayComplete, getJournalEntry, state, isLoading, isProgramComplete } = useAppContext();
  const { loading: authLoading } = useAuth();
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Show loading state while authentication is being processed
  if (authLoading) {
    return (
      <LoadingSpinner 
        fullScreen 
        size="lg" 
        text="Processing Authentication" 
      />
    );
  }
  
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
      return `${baseStyles} bg-surface text-primary border-accent/30 hover:border-primary hover:shadow-sm`;
    }
  };

  const getReflectionEmoji = (day) => {
    const { hasReflection } = getDayStatus(day);
    if (hasReflection) {
      return '✍️';
    }
    return '';
  };

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

  return (
    <>
      <CompletionModal 
        isOpen={showCompletionModal} 
        onClose={() => setShowCompletionModal(false)} 
      />
      <div className="min-h-screen bg-background text-primary font-serif">
        <div className="max-w-6xl mx-auto p-4 md:p-6">
        
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-light text-primary mb-2">Your Journey</h1>
          <p className="text-accent text-sm md:text-base">Track your progress through 84 days of ascetic practice</p>
        </div>

        {/* 84-Day Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {weeks.map((weekDays, weekIndex) => {
            const isCompleted = isWeekCompleted(weekDays);
            
            return (
              <div key={weekIndex} className={getWeekContainerStyles(weekDays, weekIndex)}>
                <h3 className={`text-xs md:text-sm font-semibold mb-2 md:mb-3 text-center
                  ${isCompleted ? 'text-primary' : 'text-accent'}`}>
                  Week {weekIndex + 1}
                </h3>
                <div className="grid grid-cols-7 gap-0.5 md:gap-1">
                  {weekDays.map((day) => {
                    const { isFuture, hasReflection } = getDayStatus(day);
                    
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
                        title={`Day ${day}${hasReflection ? ' - Has reflection' : ''}`}
                      >
                        <div className="relative w-full h-full flex items-center justify-center">
                          {day}
                          {hasReflection && (
                            <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white/80 rounded-full shadow-sm"></div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Journey Finished Celebration - show if they reached day 84 */}
        {currentDay >= 84 && (
          <div className="bg-primary text-white rounded-lg shadow-lg p-6 md:p-8 mb-6 text-center border-2 border-primary">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="text-2xl md:text-3xl font-light mb-3">Journey Finished!</h2>
            <p className="text-white/90 mb-6 max-w-xl mx-auto">
              You've reached the end of the 84-day program. 
              View your journey statistics and share your achievement!
            </p>
            <button
              onClick={() => setShowCompletionModal(true)}
              className="bg-white text-primary px-6 py-3 rounded-lg hover:bg-white/90 transition-colors font-medium inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Stats & Share
            </button>
          </div>
        )}

        {/* Current Progress Summary */}
        <div className="bg-surface rounded-lg shadow-sm p-6 text-center border border-accent/20">
          <h2 className="text-xl font-light mb-4 text-primary">Your Progress</h2>
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
    </>
  );
};

export default Dashboard; 