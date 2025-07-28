import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getItem } from '../utils/localStorage';

const TimelinePage = () => {
  const navigate = useNavigate();
  const [journalEntries, setJournalEntries] = useState([]);

  // Load journalEntries from localStorage
  useEffect(() => {
    const loadJournalEntries = () => {
      const entries = [];
      
      for (let dayNumber = 1; dayNumber <= 84; dayNumber++) {
        const text = getItem(`entry-day-${dayNumber}`, '');
        const timestamp = getItem(`timestamp-day-${dayNumber}`, null);
        
        if (text && text.trim().length > 0) {
          entries.push({
            dayNumber,
            text: text.trim(),
            timestamp: timestamp || Date.now() - (84 - dayNumber) * 24 * 60 * 60 * 1000 // Mock timestamp if none exists
          });
        }
      }
      
      // Sort by timestamp descending (most recent first)
      entries.sort((a, b) => b.timestamp - a.timestamp);
      
      setJournalEntries(entries);
    };

    loadJournalEntries();
  }, []);

  // Format date as YYYY-MM-DD
  const formatDate = (timestamp) => {
    return new Date(timestamp).toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-gray-900">Timeline</h1>
              <p className="text-gray-600 mt-1">
                {journalEntries.length} reflection{journalEntries.length !== 1 ? 's' : ''} recorded
              </p>
            </div>
            
            <button
              onClick={() => navigate('/overview')}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              ← Back to Overview
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {journalEntries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reflections yet</h3>
            <p className="text-gray-600 mb-6">
              Start your journey by visiting your first day and writing a reflection.
            </p>
            <button
              onClick={() => navigate('/day/1')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Start Day 1
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {journalEntries.map((entry) => (
              <div
                key={entry.dayNumber}
                className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
              >
                {/* Entry Header */}
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Day {entry.dayNumber}
                  </h2>
                  <div className="text-sm text-gray-500">
                    {formatDate(entry.timestamp)}
                  </div>
                </div>

                {/* Journal Text */}
                <div className="prose prose-gray max-w-none">
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {entry.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelinePage; 