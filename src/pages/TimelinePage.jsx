import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { layersByWeek } from '../data/layersByWeek.js';
import { getItem } from '../utils/localStorage';

const TimelinePage = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Load all journal entries from localStorage
  useEffect(() => {
    const loadEntries = () => {
      const allEntries = [];
      
      for (let day = 1; day <= 84; day++) {
        const entryText = getItem(`entry-day-${day}`, '');
        const timestamp = getItem(`timestamp-day-${day}`, null);
        
        if (entryText && entryText.trim().length > 0) {
          const weekNumber = Math.ceil(day / 7);
          const layerData = layersByWeek[weekNumber];
          
          allEntries.push({
            day,
            week: weekNumber,
            layerTitle: layerData?.title || '',
            layerDescription: layerData?.description || '',
            text: entryText.trim(),
            timestamp: timestamp || Date.now() - (84 - day) * 24 * 60 * 60 * 1000, // Mock timestamp if none exists
            wordCount: entryText.trim().split(/\s+/).length
          });
        }
      }
      
      // Sort by day number descending (most recent first)
      allEntries.sort((a, b) => b.day - a.day);
      
      setEntries(allEntries);
      setLoading(false);
    };

    loadEntries();
  }, []);

  // Filter entries based on search term
  const filteredEntries = entries.filter(entry =>
    entry.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.layerTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `day ${entry.day}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date for display
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get relative time
  const getRelativeTime = (timestamp) => {
    const now = Date.now();
    const diffInDays = Math.floor((now - timestamp) / (24 * 60 * 60 * 1000));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your reflections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-light text-gray-900">
                Your Journey Timeline
              </h1>
              <p className="text-gray-600 mt-2">
                {entries.length} reflection{entries.length !== 1 ? 's' : ''} recorded
              </p>
            </div>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Dashboard
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search your reflections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {searchTerm && (
            <p className="text-sm text-gray-600 mt-2">
              {filteredEntries.length} result{filteredEntries.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>
      </div>

      {/* Timeline Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No matching reflections found' : 'No reflections yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try a different search term or browse all reflections.' 
                : 'Start your journey by visiting your first day and writing a reflection.'
              }
            </p>
            {!searchTerm && (
              <Link
                to="/day/1"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Start Day 1
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {filteredEntries.map((entry) => (
              <article
                key={entry.day}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Entry Header */}
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <Link
                        to={`/day/${entry.day}`}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        Day {entry.day}
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">
                        Week {entry.week}: {entry.layerTitle}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {getRelativeTime(entry.timestamp)}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {entry.wordCount} word{entry.wordCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Entry Content */}
                <div className="px-6 py-6">
                  <div className="prose prose-gray max-w-none">
                    <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                      {entry.text}
                    </div>
                  </div>
                </div>

                {/* Entry Footer */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {formatDate(entry.timestamp)}
                    </div>
                    <Link
                      to={`/day/${entry.day}`}
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Edit reflection →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelinePage; 