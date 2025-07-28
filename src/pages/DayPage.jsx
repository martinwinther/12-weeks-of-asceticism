import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import program from '../data/program';
import weekLayers from '../data/weekLayers';
import prompts from '../data/prompts';
import { getItem, setItem } from '../utils/localStorage';

const DayPage = () => {
  const { dayNumber } = useParams();
  const navigate = useNavigate();
  const dayNum = parseInt(dayNumber);
  const [journalEntry, setJournalEntry] = useState('');

  // Validate dayNumber is between 1 and 84
  if (isNaN(dayNum) || dayNum < 1 || dayNum > 84) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Day</h1>
          <p className="text-gray-600">Please choose a day between 1 and 84.</p>
        </div>
      </div>
    );
  }

  // Calculate current week using Math.ceil(dayNumber / 7)
  const currentWeek = Math.ceil(dayNum / 7);
  
  // Get layer title from weekLayers
  const layerTitle = weekLayers[currentWeek];
  
  // Get today's action summary (same for each day of a given week)
  const weekData = program[currentWeek - 1];
  
  // Get daily reflection prompt (cycle through 7 prompts per week)
  const dayOfWeek = ((dayNum - 1) % 7) + 1; // 1-7
  const dailyPrompt = prompts[currentWeek]?.[dayOfWeek - 1] || '';

  // Load existing entry from localStorage on mount
  useEffect(() => {
    const existingEntry = getItem(`entry-day-${dayNum}`, '');
    setJournalEntry(existingEntry);
  }, [dayNum]);

  // Save entry to localStorage immediately on change (autosave)
  const handleJournalChange = (e) => {
    const value = e.target.value;
    setJournalEntry(value);
    setItem(`entry-day-${dayNum}`, value);
  };

  // Navigation handlers
  const goToPreviousDay = () => {
    if (dayNum > 1) {
      navigate(`/day/${dayNum - 1}`);
    }
  };

  const goToNextDay = () => {
    if (dayNum < 84) {
      navigate(`/day/${dayNum + 1}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-2">Day {dayNum}</h1>
          <h2 className="text-lg font-normal text-gray-600">
            Week {currentWeek} – Layer: {layerTitle}
          </h2>
        </div>

        {/* Section 1: Today's Action Summary */}
        <div className="mb-12">
          <h3 className="text-xl font-medium text-gray-900 mb-4">Today's Practice</h3>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 font-medium mb-3">{weekData?.description}</p>
            <ul className="space-y-2">
              {weekData?.details.map((detail, index) => (
                <li key={index} className="text-gray-600 text-sm">
                  • {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 2: Daily Reflection Prompt */}
        <div className="mb-12">
          <h3 className="text-xl font-medium text-gray-900 mb-4">Today's Reflection</h3>
          <div className="border-l-4 border-gray-300 pl-6">
            <p className="text-gray-800 font-medium italic">
              {dailyPrompt}
            </p>
          </div>
        </div>

        {/* Section 3: Journal Textarea */}
        <div className="mb-12">
          <h3 className="text-xl font-medium text-gray-900 mb-4">Your Journal</h3>
          <textarea
            className="w-full h-64 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent font-mono text-sm leading-relaxed"
            value={journalEntry}
            onChange={handleJournalChange}
            placeholder="Write your thoughts and reflections..."
          />
          <p className="text-xs text-gray-500 mt-2">Your entry is automatically saved as you type.</p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={goToPreviousDay}
            disabled={dayNum === 1}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
              dayNum === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            ← Previous Day
          </button>
          
          <div className="text-sm text-gray-500">
            {dayNum} of 84
          </div>
          
          <button
            onClick={goToNextDay}
            disabled={dayNum === 84}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
              dayNum === 84
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Next Day →
          </button>
        </div>

      </div>
    </div>
  );
};

export default DayPage; 