import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { layersByWeek } from '../data/layersByWeek.js';
import { getItem } from '../utils/localStorage';

const OverviewPage = () => {
  const navigate = useNavigate();
  const [completedDays, setCompletedDays] = useState(new Set());
  const [currentDay, setCurrentDay] = useState(1);

  // Load completion status from localStorage on mount
  useEffect(() => {
    const completed = new Set();
    let today = 1;
    
    for (let day = 1; day <= 84; day++) {
      const isComplete = getItem(`complete-day-${day}`, false);
      const hasEntry = getItem(`entry-day-${day}`, '').trim().length > 0;
      
      if (isComplete || hasEntry) {
        completed.add(day);
        today = Math.max(today, day + 1);
      }
    }
    
    setCompletedDays(completed);
    setCurrentDay(Math.min(today, 84));
  }, []);

  // Calculate progress
  const totalCompleted = completedDays.size;
  const progressPercentage = Math.round((totalCompleted / 84) * 100);

  // Export journals function
  const exportJournals = () => {
    let content = '# 12 Weeks of Asceticism - Journal Entries\n\n';
    content += `Exported on: ${new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}\n\n`;
    content += '---\n\n';

    let hasEntries = false;

    for (let day = 1; day <= 84; day++) {
      const entryText = getItem(`entry-day-${day}`, '');
      
      if (entryText && entryText.trim().length > 0) {
        hasEntries = true;
        const weekNumber = Math.ceil(day / 7);
        const layerData = layersByWeek[weekNumber];
        
        // Create a mock date for the entry (can be enhanced with real timestamps later)
        const entryDate = new Date();
        entryDate.setDate(entryDate.getDate() - (84 - day));
        const formattedDate = entryDate.toISOString().split('T')[0]; // YYYY-MM-DD
        
        content += `## Day ${day} – ${formattedDate}\n\n`;
        content += `**Week ${weekNumber}: ${layerData?.title || 'Unknown'}**\n\n`;
        content += `${entryText.trim()}\n\n`;
        content += '---\n\n';
      }
    }

    if (!hasEntries) {
      content += 'No journal entries found. Start your ascetic journey by writing your first reflection!\n\n';
    }

    // Create and download the file
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ascetic-journals.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generate days array for grid
  const days = Array.from({ length: 84 }, (_, index) => index + 1);

  // Get day status
  const getDayStatus = (day) => {
    if (completedDays.has(day)) return 'completed';
    if (day === currentDay) return 'current';
    if (day < currentDay) return 'incomplete';
    return 'future';
  };

  // Get day styles
  const getDayStyles = (day) => {
    const status = getDayStatus(day);
    const baseStyles = "aspect-square flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 hover:scale-105";
    
    switch (status) {
      case 'completed':
        return `${baseStyles} bg-green-100 text-green-800 border-2 border-green-200 hover:bg-green-200`;
      case 'current':
        return `${baseStyles} bg-blue-100 text-blue-800 border-2 border-blue-400 ring-2 ring-blue-200 hover:bg-blue-200`;
      case 'incomplete':
        return `${baseStyles} bg-yellow-50 text-yellow-700 border-2 border-yellow-200 hover:bg-yellow-100`;
      case 'future':
        return `${baseStyles} bg-gray-50 text-gray-400 border-2 border-gray-200 hover:bg-gray-100`;
      default:
        return baseStyles;
    }
  };

  // Get week title
  const getWeekTitle = (day) => {
    const week = Math.ceil(day / 7);
    return layersByWeek[week]?.title || '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light text-gray-900">
                12 Weeks of Asceticism
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                84 days of mindful practice
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {totalCompleted}/84
                </div>
                <div className="text-sm text-gray-600">
                  {progressPercentage}% complete
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={exportJournals}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Export</span>
                </button>
                
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  Dashboard
                </button>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Week-by-Week Grid */}
        <div className="space-y-8">
          {Array.from({ length: 12 }, (_, weekIndex) => {
            const weekNumber = weekIndex + 1;
            const weekStartDay = (weekIndex * 7) + 1;
            const weekDays = days.slice(weekStartDay - 1, weekStartDay + 6);
            const weekLayer = layersByWeek[weekNumber];
            
            return (
              <div key={weekNumber} className="bg-white rounded-lg shadow-sm p-6">
                
                {/* Week Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Week {weekNumber}: {weekLayer?.title}
                      </h2>
                      <p className="text-gray-600 text-sm mt-1">
                        {weekLayer?.description}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      Days {weekStartDay}-{weekStartDay + 6}
                    </div>
                  </div>
                </div>
                
                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-3">
                  {weekDays.map((day) => (
                    <Link
                      key={day}
                      to={`/day/${day}`}
                      className={getDayStyles(day)}
                    >
                      <div className="text-center">
                        <div className="font-semibold">{day}</div>
                        {getDayStatus(day) === 'completed' && (
                          <div className="text-xs mt-1">✓</div>
                        )}
                        {getDayStatus(day) === 'current' && (
                          <div className="text-xs mt-1">●</div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
                
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 border-2 border-green-200 rounded-md flex items-center justify-center">
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
              <div className="w-8 h-8 bg-yellow-50 border-2 border-yellow-200 rounded-md"></div>
              <span className="text-sm text-gray-700">Available</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-50 border-2 border-gray-200 rounded-md"></div>
              <span className="text-sm text-gray-700">Future</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OverviewPage; 