import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'ascetic-app-state';

const defaultState = {
  currentWeek: 1,
  completedWeeks: [],
  journalEntries: {},
};

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setCurrentWeek = (week) => setState((s) => ({ ...s, currentWeek: week }));
  const completeWeek = (week) => setState((s) => ({
    ...s,
    completedWeeks: s.completedWeeks.includes(week)
      ? s.completedWeeks
      : [...s.completedWeeks, week],
  }));
  const setJournalEntry = (weekNumber, text) => setState((s) => ({
    ...s,
    journalEntries: { ...s.journalEntries, [weekNumber]: text },
  }));
  const getJournalEntry = (weekNumber) => state.journalEntries[weekNumber] || '';

  return (
    <AppContext.Provider
      value={{
        ...state,
        setCurrentWeek,
        completeWeek,
        setJournalEntry,
        getJournalEntry,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}; 