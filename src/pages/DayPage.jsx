import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import program from '../data/program';
import { getItem, setItem } from '../utils/localStorage';

const DayPage = () => {
  const { dayNumber } = useParams();
  const dayNum = parseInt(dayNumber);
  const [journalEntry, setJournalEntry] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  // Compute currentWeek as Math.floor((dayNumber - 1) / 7) + 1
  const currentWeek = Math.floor((dayNum - 1) / 7) + 1;

  // Load the week's prompt from program[currentWeek - 1].prompt
  const weekPrompt = program[currentWeek - 1]?.prompt || '';

  // Display active actions (program.slice(0, currentWeek))
  const activeActions = program.slice(0, currentWeek);

  // On mount load any existing entry from localStorage
  useEffect(() => {
    const existingEntry = getItem(`entry-day-${dayNum}`, '');
    const completionStatus = getItem(`complete-day-${dayNum}`, false);
    setJournalEntry(existingEntry);
    setIsComplete(completionStatus);
  }, [dayNum]);

  // On change save the entry back to localStorage immediately
  const handleJournalChange = (e) => {
    const value = e.target.value;
    setJournalEntry(value);
    setItem(`entry-day-${dayNum}`, value);
  };

  // Mark complete button that sets a flag in localStorage
  const handleMarkComplete = () => {
    const newCompleteStatus = !isComplete;
    setIsComplete(newCompleteStatus);
    setItem(`complete-day-${dayNum}`, newCompleteStatus);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={`Day ${dayNum}`} />
      
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        
        {/* Day Number Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900">Day {dayNum}</h1>
          <p className="text-gray-600 mt-2">Week {currentWeek} of your ascetic journey</p>
        </div>

        {/* Active Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Active Practices</h2>
          <div className="space-y-4">
            {activeActions.map((week) => (
              <div key={week.week} className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Week {week.week}: {week.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{week.description}</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {week.details.map((detail, index) => (
                    <li key={index} className="text-sm">{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Week Prompt */}
        {weekPrompt && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Reflection Prompt</h2>
            <div className="bg-blue-50 rounded-md p-4 mb-4">
              <p className="text-gray-800 font-medium">{weekPrompt}</p>
            </div>
          </div>
        )}

        {/* Reflection Entry */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Reflection</h2>
          <textarea
            className="w-full min-h-[200px] p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
            value={journalEntry}
            onChange={handleJournalChange}
            placeholder="Write your thoughts and reflections for today..."
          />
        </div>

        {/* Mark Complete Button */}
        <div className="bg-white rounded-lg shadow p-6">
          <button
            onClick={handleMarkComplete}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              isComplete
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isComplete ? 'Day Completed ✓' : 'Mark Day Complete'}
          </button>
          {isComplete && (
            <p className="text-green-600 text-sm mt-2">
              Great work! You've completed Day {dayNum}.
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default DayPage; 