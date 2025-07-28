import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';
import { getItem } from '../utils/localStorage';

const STORAGE_KEY = 'ascetic-app-state';

const defaultState = {
  currentWeek: 1,
  completedWeeks: [],
  journalEntries: {},
  currentDay: 1,
  completedDays: [],
  startDate: null, // Will be set when user begins journey
};

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const [state, setState] = useState(defaultState);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress data from Supabase on mount or user change
  useEffect(() => {
    const loadProgressData = async () => {
      if (!user) {
        // If no user, load from localStorage as fallback
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const parsedState = JSON.parse(stored);
            setState({
              ...defaultState,
              ...parsedState,
              currentDay: parsedState.currentDay || 1,
              completedDays: parsedState.completedDays || [],
              startDate: parsedState.startDate || null,
            });
          } catch (error) {
            console.warn('Failed to parse stored state, using defaults:', error);
            setState(defaultState);
          }
        }
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('progress')
          .select('completed_days, start_date')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Error loading progress data:', error);
        } else if (data) {
          setState(prevState => ({
            ...prevState,
            completedDays: data.completed_days || [],
            startDate: data.start_date || null,
          }));
        }
      } catch (error) {
        console.error('Error loading progress data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgressData();
  }, [user]);

  // Calculate current day based on calendar date since start
  const getCurrentDay = () => {
    if (!state.startDate) {
      return 1; // Journey hasn't started yet
    }
    
    const startDate = new Date(state.startDate);
    const today = new Date();
    const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    
    // Current day is days since start + 1, capped at 84
    return Math.min(Math.max(daysSinceStart + 1, 1), 84);
  };

  // Check if a day is available (unlocked) based on calendar
  const isDayAvailable = (dayNumber) => {
    if (!state.startDate) {
      return dayNumber === 1; // Only day 1 available before journey starts
    }
    
    const currentDay = getCurrentDay();
    return dayNumber <= currentDay;
  };

  // Helper function to sync progress data to Supabase
  const syncProgressToSupabase = async (updatedState) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('progress')
        .upsert({
          user_id: user.id,
          completed_days: updatedState.completedDays,
          start_date: updatedState.startDate,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error syncing progress to Supabase:', error);
      }
    } catch (error) {
      console.error('Error syncing progress to Supabase:', error);
    }
  };

  // Start the journey by setting today as day 1
  const startJourney = async () => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const updatedState = { ...state, startDate: today };
    setState(updatedState);
    await syncProgressToSupabase(updatedState);
  };

  // Reset journey (for testing or restarting)
  const resetJourney = async () => {
    const updatedState = { ...state, startDate: null, completedDays: [], journalEntries: {} };
    setState(updatedState);
    await syncProgressToSupabase(updatedState);
    
    // Also clear localStorage entries
    for (let day = 1; day <= 84; day++) {
      localStorage.removeItem(`entry-day-${day}`);
      localStorage.removeItem(`complete-day-${day}`);
      localStorage.removeItem(`timestamp-day-${day}`);
    }
  };

  // Save to localStorage as fallback when state changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoading]);

  const setCurrentWeek = (week) => setState((s) => ({ ...s, currentWeek: week }));
  const setCurrentDay = (day) => setState((s) => ({ ...s, currentDay: day }));
  
  const completeWeek = (week) => setState((s) => ({
    ...s,
    completedWeeks: s.completedWeeks.includes(week)
      ? s.completedWeeks
      : [...s.completedWeeks, week],
  }));
  
  const completeDay = async (day) => {
    const currentCompletedDays = state.completedDays || [];
    if (currentCompletedDays.includes(day)) return; // Already completed
    
    const updatedState = {
      ...state,
      completedDays: [...currentCompletedDays, day],
    };
    setState(updatedState);
    await syncProgressToSupabase(updatedState);
  };
  
  const setJournalEntry = async (weekNumber, text) => {
    setState((s) => ({
      ...s,
      journalEntries: { ...s.journalEntries, [weekNumber]: text },
    }));
    
    // Auto-complete day if journal entry has content
    const dayNumber = parseInt(weekNumber);
    if (text.trim() && !isNaN(dayNumber)) {
      await completeDay(dayNumber);
    }
  };
  
  const getJournalEntry = (weekNumber) => state.journalEntries[weekNumber] || '';
  
  const isDayComplete = (day) => {
    const hasJournal = state.journalEntries[day.toString()]?.trim().length > 0;
    const hasLocalStorageEntry = getItem(`entry-day-${day}`, '').trim().length > 0;
    const isMarkedComplete = getItem(`complete-day-${day}`, false);
    return hasJournal || hasLocalStorageEntry || isMarkedComplete || (state.completedDays || []).includes(day);
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        currentDay: getCurrentDay(), // Use dynamic calculation
        hasStarted: !!state.startDate, // Boolean for whether journey has begun
        isLoading,
        setCurrentWeek,
        setCurrentDay,
        completeWeek,
        completeDay,
        setJournalEntry,
        getJournalEntry,
        isDayComplete,
        isDayAvailable,
        startJourney,
        resetJourney,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}; 