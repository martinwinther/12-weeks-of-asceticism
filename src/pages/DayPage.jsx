import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { layersByWeek } from '../data/layersByWeek';
import { promptsByWeek } from '../data/promptsByWeek';
import { getItem, setItem } from '../utils/localStorage';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const DayPage = () => {
  const { dayNumber } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDayAvailable, hasStarted, startJourney, currentDay } = useAppContext();
  const dayNum = parseInt(dayNumber);
  const [journalEntry, setJournalEntry] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

  // Check if journey has started and day is available
  if (!hasStarted && dayNum > 1) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-serif">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-primary mb-4">Journey Not Started</h1>
          <p className="text-accent mb-6">You need to begin your 84-day ascetic journey to access this day.</p>
          <button
            onClick={() => navigate('/day/1')}
            className="bg-primary text-white px-6 py-3 rounded-md hover:bg-accent transition-colors font-medium"
          >
            Start with Day 1
          </button>
        </div>
      </div>
    );
  }

  if (!isDayAvailable(dayNum)) {
    const daysToWait = dayNum - currentDay;
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-serif">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-primary mb-4">Day {dayNum} Locked</h1>
          <p className="text-accent mb-4">This day isn't available yet. You're currently on Day {currentDay}.</p>
          <p className="text-accent/80 text-sm mb-6">
            Come back in {daysToWait} day{daysToWait !== 1 ? 's' : ''} to unlock this day.
          </p>
          <button
            onClick={() => navigate(`/day/${currentDay}`)}
            className="bg-primary text-white px-6 py-3 rounded-md hover:bg-accent transition-colors font-medium mr-3"
          >
            Go to Day {currentDay}
          </button>
          <button
            onClick={() => navigate('/overview')}
            className="bg-white text-primary border-2 border-primary px-6 py-3 rounded-md hover:bg-background transition-colors font-medium"
          >
            View Overview
          </button>
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

  // Helper function to load journal entry from Supabase
  const loadJournalFromSupabase = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('journals')
        .select('text, updated_at')
        .eq('user_id', user.id)
        .eq('day_number', dayNum)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading journal entry from Supabase:', error);
        return null;
      }

      return data?.text || null;
    } catch (error) {
      console.error('Error loading journal entry from Supabase:', error);
      return null;
    }
  };

  // Helper function to save journal entry to Supabase
  const saveJournalToSupabase = async (text) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('journals')
        .upsert({
          user_id: user.id,
          day_number: dayNum,
          text: text,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving journal entry to Supabase:', error);
      }
    } catch (error) {
      console.error('Error saving journal entry to Supabase:', error);
    }
  };

  // Load journal entry based on authentication status
  useEffect(() => {
    const loadJournalEntry = async () => {
      setIsLoading(true);
      
      if (user) {
        // Authenticated users: load from Supabase only
        try {
          const supabaseEntry = await loadJournalFromSupabase();
          setJournalEntry(supabaseEntry || '');
        } catch (error) {
          console.error('Error loading journal entry from Supabase:', error);
          setJournalEntry('');
        }
      } else {
        // Non-authenticated users: load from localStorage only
        const localEntry = getItem(`entry-day-${dayNum}`, '');
        setJournalEntry(localEntry);
      }
      
      setIsLoading(false);
    };

    loadJournalEntry();
  }, [dayNum, user]);

  // Save entry based on authentication status
  const handleJournalChange = (e) => {
    const value = e.target.value;
    setJournalEntry(value);
    
    if (user) {
      // Authenticated users: save to Supabase only with debouncing
      if (handleJournalChange.timeoutId) {
        clearTimeout(handleJournalChange.timeoutId);
      }
      
      setIsSaving(true);
      handleJournalChange.timeoutId = setTimeout(async () => {
        try {
          await saveJournalToSupabase(value);
        } catch (error) {
          console.error('Error auto-saving to Supabase:', error);
        } finally {
          setIsSaving(false);
        }
      }, 1000); // Save 1 second after user stops typing
    } else {
      // Non-authenticated users: save to localStorage immediately
      setItem(`entry-day-${dayNum}`, value);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (handleJournalChange.timeoutId) {
        clearTimeout(handleJournalChange.timeoutId);
      }
    };
  }, []);

  // Navigation handlers
  const goToPreviousDay = () => {
    if (dayNum > 1) {
      navigate(`/day/${dayNum - 1}`);
    }
  };

  const goToNextDay = () => {
    if (dayNum < 84 && isDayAvailable(dayNum + 1)) {
      navigate(`/day/${dayNum + 1}`);
    }
  };

  return (
    <div className="min-h-screen bg-background font-serif text-primary">
      <div className="max-w-2xl mx-auto px-4 py-6 md:px-6 md:py-12">
        
        {/* Header - Current Week's Layer Title and Description */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-light text-primary mb-2">Day {dayNum}</h1>
          <h2 className="text-base md:text-lg font-normal text-accent mb-4">
            Week {weekNumber}: {currentWeekLayer?.title}
          </h2>
          <p className="text-accent max-w-lg mx-auto text-sm md:text-base">
            {currentWeekLayer?.description}
          </p>
        </div>

        {/* Active Actions - Stacked List */}
        <div className="mb-8 md:mb-12">
          <h3 className="text-lg md:text-xl font-medium text-primary mb-4 md:mb-6">Active Practices</h3>
          <div className="space-y-3 md:space-y-4">
            {activeActions.map((layer, index) => (
              <div key={index} className="bg-white rounded-lg p-3 md:p-4 border-l-4 border-primary shadow-sm border border-accent/20">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-primary mb-2 text-sm md:text-base">
                      Week {index + 1}: {layer.title}
                    </h4>
                    <p className="text-accent text-xs md:text-sm">
                      {layer.action}
                    </p>
                  </div>
                  <div className="ml-2 md:ml-4 text-xs text-accent bg-background rounded-full px-2 py-1 shrink-0">
                    Week {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reflection Prompt */}
        <div className="mb-8 md:mb-12">
          <h3 className="text-lg md:text-xl font-medium text-primary mb-4">This Week's Reflection</h3>
          <div className="bg-primary/10 rounded-lg p-4 md:p-6 border-l-4 border-primary">
            <p className="text-primary font-medium italic text-base md:text-lg">
              {reflectionPrompt}
            </p>
          </div>
        </div>

        {/* Start Journey Button for Day 1 */}
        {dayNum === 1 && !hasStarted && (
          <div className="mb-8 md:mb-12 text-center">
            <div className="bg-primary/10 rounded-lg p-4 md:p-6 border border-primary/20">
              <h3 className="text-lg md:text-xl font-medium text-primary mb-4">Begin Your 84-Day Journey</h3>
              <p className="text-accent mb-6 text-sm md:text-base">
                Ready to start your ascetic practice? Click below to begin Day 1 and unlock your daily progression.
              </p>
              <button
                onClick={() => startJourney()}
                className="bg-primary text-white px-6 py-3 md:px-8 rounded-md hover:bg-accent transition-colors font-medium text-sm md:text-base"
              >
                Start Journey
              </button>
            </div>
          </div>
        )}

        {/* Journal Textarea */}
        <div className="mb-8 md:mb-12">
          <h3 className="text-lg md:text-xl font-medium text-primary mb-4">Your Journal</h3>
          <div className="relative">
            <textarea
              className="w-full h-48 md:h-64 p-3 md:p-4 border border-accent/30 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent font-mono text-sm leading-relaxed"
              value={journalEntry}
              onChange={handleJournalChange}
              placeholder={isLoading ? "Loading your entry..." : "Write your thoughts and reflections..."}
              disabled={isLoading}
            />
            {(isLoading || isSaving) && (
              <div className="absolute top-2 right-2">
                <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <p className="text-xs text-accent mt-2">
            {isLoading ? 'Loading...' : 
             isSaving ? 'Saving to cloud...' : 
             user ? 'Auto-saved to cloud' : 
             'Auto-saved locally (sign in to sync across devices)'}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
          <button
            onClick={goToPreviousDay}
            disabled={dayNum === 1}
            className={`px-4 py-3 md:px-6 md:py-2 text-sm font-medium rounded-md transition-colors touch-manipulation ${
              dayNum === 1
                ? 'text-accent/50 cursor-not-allowed'
                : 'text-accent hover:text-primary hover:bg-background'
            }`}
          >
            <span className="hidden md:inline">← Previous Day</span>
            <span className="md:hidden">← Previous</span>
          </button>
          
          <div className="text-sm text-accent text-center md:order-none">
            {dayNum} of 84
          </div>
          
          <button
            onClick={goToNextDay}
            disabled={dayNum === 84 || !isDayAvailable(dayNum + 1)}
            className={`px-4 py-3 md:px-6 md:py-2 text-sm font-medium rounded-md transition-colors touch-manipulation ${
              dayNum === 84 || !isDayAvailable(dayNum + 1)
                ? 'text-accent/50 cursor-not-allowed'
                : 'text-accent hover:text-primary hover:bg-background'
            }`}
          >
            <span className="hidden md:inline">
              {dayNum === 84 ? 'Final Day' : !isDayAvailable(dayNum + 1) ? 'Locked →' : 'Next Day →'}
            </span>
            <span className="md:hidden">
              {dayNum === 84 ? 'Final' : !isDayAvailable(dayNum + 1) ? 'Locked →' : 'Next →'}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default DayPage; 