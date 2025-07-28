import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { layersByWeek } from '../data/layersByWeek';
import { getItem } from '../utils/localStorage';

const OverviewPage = () => {
  const navigate = useNavigate();
  const [completedDays, setCompletedDays] = useState([]);
  const [currentDay, setCurrentDay] = useState(1);

  // Load completedDays from localStorage
  useEffect(() => {
    const completed = [];
    let today = 1;
    
    for (let day = 1; day <= 84; day++) {
      const isComplete = getItem(`complete-day-${day}`, false);
      const hasEntry = getItem(`entry-day-${day}`, '').trim().length > 0;
      
      if (isComplete || hasEntry) {
        completed.push(day);
        today = Math.max(today, day + 1);
      }
    }
    
    setCompletedDays(completed);
    setCurrentDay(Math.min(today, 84));
  }, []);

  // Calculate progress
  const progressPercentage = Math.round((completedDays.length / 84) * 100);

  // Get day styles
  const getDayStyles = (dayNumber) => {
    const isCompleted = completedDays.includes(dayNumber);
    const isToday = dayNumber === currentDay;
    
    let styles = "aspect-square flex items-center justify-center rounded-md text-sm font-medium cursor-pointer transition-all duration-200 hover:scale-105 ";
    
    if (isCompleted) {
      styles += "bg-green-100 text-green-800 border-2 border-green-300 hover:bg-green-200";
    } else if (isToday) {
      styles += "bg-blue-100 text-blue-800 border-2 border-blue-400 ring-2 ring-blue-300 hover:bg-blue-200";
    } else {
      styles += "bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100";
    }
    
    return styles;
  };

  // Handle day click
  const handleDayClick = (dayNumber) => {
    navigate(`/day/${dayNumber}`);
  };

  // Generate 12 weeks of 7 days each
  const weeks = Array.from({ length: 12 }, (_, weekIndex) => {
    const startDay = weekIndex * 7 + 1;
    return Array.from({ length: 7 }, (_, dayIndex) => startDay + dayIndex);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-light text-gray-900">Overview</h1>
            <p className="text-gray-600 mt-1">84 days of ascetic practice</p>
          </div>

          {/* Progress Indicator */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-700">
                {completedDays.length}/84 days ({progressPercentage}% complete)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 12 × 7 Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {weeks.map((week, weekIndex) => {
            const weekNumber = weekIndex + 1;
            const weekLayer = layersByWeek[weekNumber];
            
            return (
              <div key={weekIndex} className="bg-white rounded-lg shadow-sm p-6">
                {/* Week Header */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Week {weekNumber}: {weekLayer?.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {weekLayer?.description}
                  </p>
                </div>
                
                {/* Week Grid - 7 days */}
                <div className="grid grid-cols-7 gap-2">
                  {week.map((dayNumber) => (
                    <div
                      key={dayNumber}
                      onClick={() => handleDayClick(dayNumber)}
                      className={getDayStyles(dayNumber)}
                    >
                      <div className="text-center">
                        <div className="font-semibold">{dayNumber}</div>
                        {completedDays.includes(dayNumber) && (
                          <div className="text-xs mt-1">✓</div>
                        )}
                        {dayNumber === currentDay && (
                          <div className="text-xs mt-1">●</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Legend</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 border-2 border-green-300 rounded-md flex items-center justify-center">
                <span className="text-green-800 text-xs">✓</span>
              </div>
              <span className="text-sm text-gray-700">Completed</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 border-2 border-blue-400 rounded-md flex items-center justify-center">
                <span className="text-blue-800 text-xs">●</span>
              </div>
              <span className="text-sm text-gray-700">Current Day</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-50 border-2 border-gray-200 rounded-md"></div>
              <span className="text-sm text-gray-700">Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage; 