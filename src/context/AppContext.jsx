import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [state, setState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedState = JSON.parse(stored);
        // Migrate old data to include new properties
        return {
          ...defaultState,
          ...parsedState,
          // Ensure new properties exist with defaults if not present
          currentDay: parsedState.currentDay || 1,
          completedDays: parsedState.completedDays || [],
          startDate: parsedState.startDate || null,
        };
      } catch (error) {
        console.warn('Failed to parse stored state, using defaults:', error);
        return defaultState;
      }
    }
    return defaultState;
  });

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

  // Start the journey by setting today as day 1
  const startJourney = () => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    setState((s) => ({ ...s, startDate: today }));
  };

  // Reset journey (for testing or restarting)
  const resetJourney = () => {
    setState((s) => ({ ...s, startDate: null, completedDays: [], journalEntries: {} }));
    // Also clear localStorage entries
    for (let day = 1; day <= 84; day++) {
      localStorage.removeItem(`entry-day-${day}`);
      localStorage.removeItem(`complete-day-${day}`);
      localStorage.removeItem(`timestamp-day-${day}`);
    }
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setCurrentWeek = (week) => setState((s) => ({ ...s, currentWeek: week }));
  const setCurrentDay = (day) => setState((s) => ({ ...s, currentDay: day }));
  
  const completeWeek = (week) => setState((s) => ({
    ...s,
    completedWeeks: s.completedWeeks.includes(week)
      ? s.completedWeeks
      : [...s.completedWeeks, week],
  }));
  
  const completeDay = (day) => setState((s) => ({
    ...s,
    completedDays: (s.completedDays || []).includes(day)
      ? s.completedDays
      : [...(s.completedDays || []), day],
  }));
  
  const setJournalEntry = (weekNumber, text) => {
    setState((s) => ({
      ...s,
      journalEntries: { ...s.journalEntries, [weekNumber]: text },
    }));
    
    // Auto-complete day if journal entry has content
    const dayNumber = parseInt(weekNumber);
    if (text.trim() && !isNaN(dayNumber)) {
      completeDay(dayNumber);
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