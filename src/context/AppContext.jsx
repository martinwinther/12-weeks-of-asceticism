import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';
import { sanitizeText, validateText } from '../utils/sanitize';

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

  // Load data from Supabase (all users are authenticated)
  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        // Load progress data from Supabase
        let progressData = null;
        let progressError = null;
        
        try {
          const result = await supabase
            .from('progress')
            .select('completed_days, start_date')
            .eq('user_id', user.id)
            .single();
          
          progressData = result.data;
          progressError = result.error;
        } catch (queryError) {
          console.error('Supabase query failed:', queryError);
          progressError = queryError;
        }

        // Load journal entries from Supabase
        let journalData = null;
        let journalError = null;
        
        try {
          const result = await supabase
            .from('journals')
            .select('day_number, text')
            .eq('user_id', user.id);
          
          journalData = result.data;
          journalError = result.error;
        } catch (queryError) {
          console.error('Journal query failed:', queryError);
          journalError = queryError;
        }

        if (progressError && progressError.code !== 'PGRST116') {
          console.error('Error loading progress data:', progressError);
          console.error('Progress error details:', {
            code: progressError.code,
            message: progressError.message,
            details: progressError.details,
            hint: progressError.hint
          });
        }

        if (journalError) {
          console.error('Error loading journal data:', journalError);
        }

        console.log('Loaded data from Supabase:', {
          progressData,
          journalData: journalData?.length || 0,
          user: user.id
        });

        // Build journal entries object from Supabase data
        const journalEntries = {};
        if (journalData) {
          journalData.forEach(entry => {
            // Sanitize text when loading (in case of legacy data)
            const text = entry.text || '';
            journalEntries[entry.day_number.toString()] = text ? sanitizeText(text) : '';
          });
        }

        // Update state with Supabase data
        const updatedState = {
          ...defaultState,
          completedDays: progressData?.completed_days || [],
          startDate: progressData?.start_date || null,
          journalEntries: journalEntries,
        };

        // If user has journal entries but no start date, auto-start the journey
        if (!progressData?.start_date && journalData && journalData.length > 0) {
          console.log('Auto-starting journey for user with existing journal entries');
          const today = new Date().toISOString().split('T')[0];
          updatedState.startDate = today;
          
          // Save the start date to Supabase
          try {
            await supabase
              .from('progress')
              .upsert({
                user_id: user.id,
                start_date: today,
                completed_days: [],
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'user_id'
              });
          } catch (error) {
            console.error('Error saving auto-start date:', error);
          }
        }

        // If no progress data exists for this user, create a default entry
        if (!progressData && !journalData) {
          console.log('Creating default progress entry for new user');
          const today = new Date().toISOString().split('T')[0];
          updatedState.startDate = today;
          
          // Save the start date to Supabase
          try {
            await supabase
              .from('progress')
              .upsert({
                user_id: user.id,
                start_date: today,
                completed_days: [],
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'user_id'
              });
          } catch (error) {
            console.error('Error creating default progress entry:', error);
          }
        }

        // If still no start date, use the existing one from the table (2025-07-28)
        if (!updatedState.startDate) {
          console.log('Using fallback start date from existing progress table');
          updatedState.startDate = '2025-07-28';
        }

        setState(updatedState);

      } catch (error) {
        console.error('Error loading data from Supabase:', error);
        setState(defaultState);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user?.id]); // Only reload when user ID changes, not on every auth refresh

  // Calculate current day based on calendar date since start
  const getCurrentDay = () => {
    if (!state.startDate) {
      console.log('No start date, returning day 1');
      return 1; // Journey hasn't started yet
    }
    
    const startDate = new Date(state.startDate);
    const today = new Date();
    
    // Reset time to midnight for accurate day comparison
    const startMidnight = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const daysSinceStart = Math.floor((todayMidnight - startMidnight) / (1000 * 60 * 60 * 24));
    
    // Current day is days since start + 1, capped at 84
    const currentDay = Math.min(Math.max(daysSinceStart + 1, 1), 84);
    
    console.log('Day calculation:', {
      startDate: state.startDate,
      startMidnight: startMidnight.toISOString(),
      todayMidnight: todayMidnight.toISOString(),
      daysSinceStart,
      currentDay
    });
    
    return currentDay;
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
        }, {
          onConflict: 'user_id'
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
    
    // Also clear journal entries from Supabase
    if (user) {
      try {
        const { error } = await supabase
          .from('journals')
          .delete()
          .eq('user_id', user.id);
          
        if (error) {
          console.error('Error clearing journal entries:', error);
        }
      } catch (error) {
        console.error('Error clearing journal entries:', error);
      }
    }
  };

  // Fix user data for users created before proper database setup
  const fixUserData = async () => {
    if (!user) return;
    
    console.log('Fixing user data for user created before proper database setup');
    
    try {
      // Delete any existing progress data for this user
      await supabase
        .from('progress')
        .delete()
        .eq('user_id', user.id);
      
      // Delete any existing journal entries for this user
      await supabase
        .from('journals')
        .delete()
        .eq('user_id', user.id);
      
      // Create fresh progress entry with today's date
      const today = new Date().toISOString().split('T')[0];
      await supabase
        .from('progress')
        .insert({
          user_id: user.id,
          start_date: today,
          completed_days: [],
          updated_at: new Date().toISOString()
        });
      
      // Reset local state
      setState({
        ...defaultState,
        startDate: today,
        completedDays: [],
        journalEntries: {},
      });
      
      console.log('User data fixed successfully');
    } catch (error) {
      console.error('Error fixing user data:', error);
    }
  };



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
  
  const getJournalEntry = (dayNumber) => {
    return state.journalEntries[dayNumber] || '';
  };

  // Update journal entry in context state
  const updateJournalEntry = (dayNumber, text) => {
    setState(prevState => ({
      ...prevState,
      journalEntries: {
        ...prevState.journalEntries,
        [dayNumber.toString()]: text
      }
    }));
  };
  
  const isDayComplete = (day) => {
    const hasJournal = state.journalEntries[day.toString()]?.trim().length > 0;
    const isMarkedComplete = (state.completedDays || []).includes(day);
    return hasJournal || isMarkedComplete;
  };

  const value = {
    state,
    isLoading,
    currentDay: getCurrentDay(),
    hasStarted: !!state.startDate || Object.keys(state.journalEntries).length > 0 || state.completedDays.length > 0,
    startJourney,
    resetJourney,
    fixUserData,
    completeWeek,
    completeDay,
    getJournalEntry,
    updateJournalEntry,
    isDayAvailable,
    isDayComplete,
    setCurrentWeek,
    setCurrentDay,
    // Debug function to manually start journey
    debugStartJourney: () => {
      console.log('Debug: Manually starting journey');
      const today = new Date().toISOString().split('T')[0];
      const updatedState = { ...state, startDate: today };
      setState(updatedState);
      syncProgressToSupabase(updatedState);
    },
  };

  return (
    <AppContext.Provider
      value={value}
    >
      {children}
    </AppContext.Provider>
  );
}; 