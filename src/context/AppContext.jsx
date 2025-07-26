import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'ascetic-app-state';

const defaultState = {
  currentWeek: 1,
  completedWeeks: [],
  journalEntries: {},
  currentDay: 1,
  completedDays: [],
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
        };
      } catch (error) {
        console.warn('Failed to parse stored state, using defaults:', error);
        return defaultState;
      }
    }
    return defaultState;
  });

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
    return hasJournal || (state.completedDays || []).includes(day);
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setCurrentWeek,
        setCurrentDay,
        completeWeek,
        completeDay,
        setJournalEntry,
        getJournalEntry,
        isDayComplete,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}; 