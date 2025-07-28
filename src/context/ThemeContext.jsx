import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();
  const [theme, setThemeState] = useState('light');
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from Supabase on mount or user change
  useEffect(() => {
    const loadTheme = async () => {
      if (!user) {
        // If no user, load from localStorage as fallback
        const savedTheme = localStorage.getItem('ascetic-theme');
        if (savedTheme && ['light', 'dark', 'monastic'].includes(savedTheme)) {
          setThemeState(savedTheme);
        }
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('progress')
          .select('theme')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Error loading theme:', error);
        } else if (data && data.theme) {
          setThemeState(data.theme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, [user]);

  // Save theme to Supabase when it changes
  const setTheme = async (newTheme) => {
    setThemeState(newTheme);
    
    // Save to localStorage as fallback
    localStorage.setItem('ascetic-theme', newTheme);

    if (!user) return;

    try {
      const { error } = await supabase
        .from('progress')
        .upsert({
          user_id: user.id,
          theme: newTheme,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving theme:', error);
      }
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}; 