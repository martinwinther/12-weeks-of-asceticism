import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonLoader from '../components/SkeletonLoader';

const TimelinePage = () => {
  const navigate = useNavigate();
  const [journalEntries, setJournalEntries] = useState([]);
  const { getJournalEntry, state, isLoading } = useAppContext();
  const { loading: authLoading } = useAuth();

  // Show loading state while authentication or data is loading
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background font-serif text-primary">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <LoadingSpinner size="lg" text="Loading your reflections..." />
          </div>
        </div>
      </div>
    );
  }

  // Load journalEntries from AppContext (Supabase data)
  useEffect(() => {
    const loadJournalEntries = () => {
      const entries = [];
      
      for (let dayNumber = 1; dayNumber <= 84; dayNumber++) {
        const text = getJournalEntry(dayNumber.toString());
        
        if (text && text.trim().length > 0) {
          entries.push({
            dayNumber,
            text: text.trim(),
            timestamp: Date.now() - (84 - dayNumber) * 24 * 60 * 60 * 1000 // Mock timestamp based on day number
          });
        }
      }
      
      // Sort by day number descending (most recent first)
      entries.sort((a, b) => b.dayNumber - a.dayNumber);
      
      setJournalEntries(entries);
    };

    loadJournalEntries();
  }, [getJournalEntry, state.journalEntries]); // Re-run when journal entries change

  // Format date as YYYY-MM-DD
  const formatDate = (timestamp) => {
    return new Date(timestamp).toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-background font-serif text-primary">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="text-center">
          <h1 className="text-3xl font-light text-primary">Timeline</h1>
          <p className="text-accent mt-1">
            {journalEntries.length} reflection{journalEntries.length !== 1 ? 's' : ''} recorded
          </p>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {journalEntries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-accent/60 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-primary mb-2">No reflections yet</h3>
            <p className="text-accent mb-6">
              Start your journey by visiting your first day and writing a reflection.
            </p>
            <button
              onClick={() => navigate('/day/1')}
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-accent transition-colors"
            >
              Start Day 1
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {journalEntries.map((entry) => (
              <div
                key={entry.dayNumber}
                className="bg-surface rounded-lg shadow-sm p-6 border border-accent/20"
              >
                {/* Entry Header */}
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-primary mb-2">
                    Day {entry.dayNumber}
                  </h2>
                  <div className="text-sm text-accent">
                    {formatDate(entry.timestamp)}
                  </div>
                </div>

                {/* Journal Text */}
                <div className="prose prose-gray max-w-none">
                  <div className="whitespace-pre-wrap text-primary leading-relaxed">
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