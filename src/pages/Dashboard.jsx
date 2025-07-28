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
    
    let baseStyles = "w-10 h-10 rounded-md flex items-center justify-center text-sm font-mono transition-all duration-200 border-2";
    
    if (isFuture) {
      return `${baseStyles} bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed`;
    } else if (isCurrent) {
      return `${baseStyles} bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300`;
    } else if (isComplete) {
      return `${baseStyles} bg-green-600 text-white border-green-600 hover:bg-green-700`;
    } else {
      return `${baseStyles} bg-white text-gray-700 border-gray-300 hover:border-blue-600 hover:shadow-sm`;
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Journey</h1>
          <p className="text-gray-600">Track your progress through 84 days of ascetic practice</p>
        </div>
        
        {/* Legend */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center text-sm bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-600"></div>
            <span>Current Day</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-600"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-white border border-gray-300"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-100"></div>
            <span>Future</span>
          </div>
          <div className="flex items-center gap-2">
            <span>✍️</span>
            <span>Has Reflection</span>
          </div>
        </div>

        {/* 84-Day Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {weeks.map((weekDays, weekIndex) => (
            <div key={weekIndex} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-600 mb-3 text-center">
                Week {weekIndex + 1}
              </h3>
              <div className="grid grid-cols-7 gap-1">
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
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Your Progress</h2>
          <div className="flex justify-center gap-8 text-sm">
            <div>
              <div className="text-2xl font-bold text-blue-600">{currentDay}</div>
              <div className="text-gray-600">Current Day</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Array.from({length: 84}, (_, i) => i + 1).filter(day => isDayComplete(day)).length}
              </div>
              <div className="text-gray-600">Days Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">
                {Array.from({length: 84}, (_, i) => i + 1).filter(day => getJournalEntry(day.toString()).trim().length > 0).length}
              </div>
              <div className="text-gray-600">Reflections Written</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard; 