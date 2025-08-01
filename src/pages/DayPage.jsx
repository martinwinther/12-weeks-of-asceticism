import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { layersByWeek } from '../data/layersByWeek';
import { promptsByWeek } from '../data/promptsByWeek';
import weeklyTeachings from '../data/weeklyTeachings';
import WeeklyTeachings from '../components/WeeklyTeachings';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { sanitizeText, validateText } from '../utils/sanitize';

const DayPage = () => {
  const { dayNumber } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDayAvailable, hasStarted, startJourney, currentDay, getJournalEntry, updateJournalEntry, isLoading: contextLoading, isPracticeComplete, togglePracticeCompletion, getDayCompletionStatus } = useAppContext();
  const dayNum = parseInt(dayNumber);
  const [journalEntry, setJournalEntry] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-start journey if authenticated user visits Day 1 and hasn't started yet
  useEffect(() => {
    if (user && dayNum === 1 && !hasStarted) {
      console.log('Auto-starting journey for day 1');
      startJourney();
    }
  }, [user, dayNum, hasStarted, startJourney]);

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
            className="bg-surface text-primary border-2 border-primary px-6 py-3 rounded-md hover:bg-background transition-colors font-medium"
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
        .maybeSingle(); // Use maybeSingle instead of single to handle no rows

      if (error) {
        console.error('Error loading journal entry from Supabase:', error);
        return null;
      }

      // If no data found, return null (no journal entry exists yet)
      if (!data) {
        return null;
      }

      // Sanitize text when loading (in case of legacy data)
      const text = data?.text || null;
      return text ? sanitizeText(text) : null;
    } catch (error) {
      console.error('Error loading journal entry from Supabase:', error);
      return null;
    }
  };

  // Helper function to save journal entry to Supabase
  const saveJournalToSupabase = async (text) => {
    if (!user) return;

    try {
      // Validate and sanitize input
      const validation = validateText(text);
      if (!validation.isValid) {
        console.error('Invalid text input:', validation.error);
        return;
      }

      const sanitizedText = sanitizeText(text);

      const { error } = await supabase
        .from('journals')
        .upsert({
          user_id: user.id,
          day_number: dayNum,
          text: sanitizedText,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,day_number'
        });

      if (error) {
        console.error('Error saving journal entry to Supabase:', error);
      }
    } catch (error) {
      console.error('Error saving journal entry to Supabase:', error);
    }
  };

  // Load journal entry from context first, then from Supabase if needed
  useEffect(() => {
    const loadJournalEntry = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        // First try to get from context
        const contextEntry = getJournalEntry(dayNum.toString());
        
        if (contextEntry) {
          setJournalEntry(contextEntry);
          setIsLoading(false);
          return;
        }
        
        // If not in context, try to load from Supabase
        const supabaseEntry = await loadJournalFromSupabase();
        
        if (supabaseEntry) {
          // Found existing entry
          setJournalEntry(supabaseEntry);
          updateJournalEntry(dayNum, supabaseEntry);
        } else {
          // No entry exists, create empty one
          setJournalEntry('');
          updateJournalEntry(dayNum, '');
        }
      } catch (error) {
        console.error('Error loading journal entry:', error);
        setJournalEntry('');
        updateJournalEntry(dayNum, '');
      } finally {
        setIsLoading(false);
      }
    };

    loadJournalEntry();
  }, [dayNum, user?.id]); // Only depend on dayNum and user.id, not the functions

  // Save entry to Supabase with debouncing
  const handleJournalChange = (e) => {
    const value = e.target.value;
    setJournalEntry(value);
    
    // Update context immediately for responsive UI
    updateJournalEntry(dayNum, value);
    
    if (!user) return; // All users must be authenticated
    
    // Debounce Supabase save to avoid too many API calls
    if (handleJournalChange.timeoutId) {
      clearTimeout(handleJournalChange.timeoutId);
    }
    
    setIsSaving(true);
    handleJournalChange.timeoutId = setTimeout(async () => {
      try {
        await saveJournalToSupabase(value);
      } catch (error) {
        console.error('Error auto-saving to Supabase:', error);
        // Don't show error to user, just log it
      } finally {
        setIsSaving(false);
      }
    }, 1000); // Save 1 second after user stops typing
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
          
          {/* Day Completion Progress */}
          {(() => {
            const completionStatus = getDayCompletionStatus(dayNum);
            const progressPercentage = completionStatus.practicesTotal > 0 
              ? Math.round(((completionStatus.practicesCompleted + (completionStatus.hasJournal ? 1 : 0)) / (completionStatus.practicesTotal + 1)) * 100)
              : completionStatus.hasJournal ? 100 : 0;
            
            return (
              <div className="mt-6 max-w-md mx-auto">
                <div className="flex items-center justify-between text-sm text-accent mb-2">
                  <span>Today's Progress</span>
                  <span>{progressPercentage}%</span>
                </div>
                <div className="w-full bg-accent/20 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs text-accent/70 mt-1">
                  <span>Practices: {completionStatus.practicesCompleted}/{completionStatus.practicesTotal}</span>
                  <span>Journal: {completionStatus.hasJournal ? '✓' : '○'}</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Active Actions - Stacked List */}
        <div className="mb-8 md:mb-12">
          <h3 className="text-lg md:text-xl font-medium text-primary mb-4 md:mb-6">Active Practices</h3>
          <div className="space-y-3 md:space-y-4">
            {activeActions.map((layer, index) => {
              const weekNumber = index + 1;
              const isCompleted = isPracticeComplete(dayNum, weekNumber);
              
              return (
                <div 
                  key={index} 
                  onClick={() => togglePracticeCompletion(dayNum, weekNumber)}
                  className={`bg-surface rounded-lg p-3 md:p-4 border-l-4 shadow-sm border border-accent/20 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
                    isCompleted 
                      ? 'border-primary/80 bg-primary/10' 
                      : 'border-primary hover:border-primary/70'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className={`font-semibold mb-2 text-sm md:text-base ${
                        isCompleted ? 'text-primary' : 'text-primary'
                      }`}>
                        Week {weekNumber}: {layer.title}
                      </h4>
                      <p className={`text-xs md:text-sm ${
                        isCompleted ? 'text-accent/80' : 'text-accent'
                      }`}>
                        {layer.action}
                      </p>
                    </div>
                    <div className="ml-2 md:ml-4 flex items-center gap-2">
                      <div className="text-xs text-accent bg-background rounded-full px-2 py-1 shrink-0">
                        Week {weekNumber}
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        isCompleted 
                          ? 'bg-primary border-primary text-white' 
                          : 'border-accent/30 hover:border-primary'
                      }`}>
                        {isCompleted && (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Teachings */}
        <WeeklyTeachings 
          weekNumber={weekNumber} 
          teachings={weeklyTeachings[weekNumber]} 
        />

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
                Ready to start your ascetic practice? We'll send you a secure link to access your account.
              </p>
              <button
                onClick={() => navigate('/auth')}
                className="bg-primary text-white px-6 py-3 md:px-8 rounded-md hover:bg-accent transition-colors font-medium text-sm md:text-base"
              >
                Get Started
              </button>
            </div>
          </div>
        )}

        {/* Journal Textarea */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg md:text-xl font-medium text-primary">Your Journal</h3>
            <div className={`flex items-center gap-2 text-sm ${
              getDayCompletionStatus(dayNum).hasJournal ? 'text-primary' : 'text-accent/70'
            }`}>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                getDayCompletionStatus(dayNum).hasJournal 
                  ? 'bg-primary border-primary text-white' 
                  : 'border-accent/30'
              }`}>
                {getDayCompletionStatus(dayNum).hasJournal && (
                  <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span>{getDayCompletionStatus(dayNum).hasJournal ? 'Complete' : 'Incomplete'}</span>
            </div>
          </div>
          <div className="relative">
            <textarea
              className="w-full h-48 md:h-64 p-3 md:p-4 border border-accent/30 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent font-mono text-sm leading-relaxed touch-manipulation"
              value={journalEntry}
              onChange={handleJournalChange}
              placeholder={isLoading ? "Loading your entry..." : "Write your thoughts and reflections..."}
              disabled={isLoading}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="sentences"
              spellCheck="true"
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
             'Auto-saved to cloud'}
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