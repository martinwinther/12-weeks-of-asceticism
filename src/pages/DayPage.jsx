import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { layersByWeek } from '../data/layersByWeek';
import { promptsByWeek } from '../data/promptsByWeek';
import { getItem, setItem } from '../utils/localStorage';

const DayPage = () => {
  const { dayNumber } = useParams();
  const navigate = useNavigate();
  const dayNum = parseInt(dayNumber);
  const [journalEntry, setJournalEntry] = useState('');

  // Validate dayNumber is between 1 and 84
  if (isNaN(dayNum) || dayNum < 1 || dayNum > 84) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-serif">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Invalid Day</h1>
          <p className="text-accent">Please choose a day between 1 and 84.</p>
        </div>
      </div>
    );
  }

  // Parse dayNumber and compute weekNumber
  const weekNumber = Math.ceil(dayNum / 7);
  
  // Get current week's layer data
  const currentWeekLayer = layersByWeek[weekNumber];
  
  // For activeActions, take Object.values(layersByWeek).slice(0, weekNumber)
  const activeActions = Object.values(layersByWeek).slice(0, weekNumber);
  
  // For the reflection prompt, use promptsByWeek[weekNumber]
  const reflectionPrompt = promptsByWeek[weekNumber] || '';

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
    <div className="min-h-screen bg-background font-serif text-primary">
      <div className="max-w-2xl mx-auto px-6 py-12">
        
        {/* Header - Current Week's Layer Title and Description */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-primary mb-2">Day {dayNum}</h1>
          <h2 className="text-lg font-normal text-accent mb-4">
            Week {weekNumber}: {currentWeekLayer?.title}
          </h2>
          <p className="text-accent max-w-lg mx-auto">
            {currentWeekLayer?.description}
          </p>
        </div>

        {/* Active Actions - Stacked List */}
        <div className="mb-12">
          <h3 className="text-xl font-medium text-primary mb-6">Active Practices</h3>
          <div className="space-y-4">
            {activeActions.map((layer, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border-l-4 border-primary shadow-sm border border-accent/20">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-primary mb-2">
                      Week {index + 1}: {layer.title}
                    </h4>
                    <p className="text-accent text-sm">
                      {layer.action}
                    </p>
                  </div>
                  <div className="ml-4 text-xs text-accent bg-background rounded-full px-2 py-1">
                    Week {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reflection Prompt */}
        <div className="mb-12">
          <h3 className="text-xl font-medium text-primary mb-4">This Week's Reflection</h3>
          <div className="bg-primary/10 rounded-lg p-6 border-l-4 border-primary">
            <p className="text-primary font-medium italic text-lg">
              {reflectionPrompt}
            </p>
          </div>
        </div>

        {/* Journal Textarea */}
        <div className="mb-12">
          <h3 className="text-xl font-medium text-primary mb-4">Your Journal</h3>
          <textarea
            className="w-full h-64 p-4 border border-accent/30 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent font-mono text-sm leading-relaxed"
            value={journalEntry}
            onChange={handleJournalChange}
            placeholder="Write your thoughts and reflections..."
          />
          <p className="text-xs text-accent mt-2">Your entry is automatically saved as you type.</p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={goToPreviousDay}
            disabled={dayNum === 1}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
              dayNum === 1
                ? 'text-accent/50 cursor-not-allowed'
                : 'text-accent hover:text-primary hover:bg-background'
            }`}
          >
            ← Previous Day
          </button>
          
          <div className="text-sm text-accent">
            {dayNum} of 84
          </div>
          
          <button
            onClick={goToNextDay}
            disabled={dayNum === 84}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
              dayNum === 84
                ? 'text-accent/50 cursor-not-allowed'
                : 'text-accent hover:text-primary hover:bg-background'
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