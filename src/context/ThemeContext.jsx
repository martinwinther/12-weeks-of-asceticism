import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';
import { getItem, setItem } from '../utils/localStorage';

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
  const [theme, setThemeState] = useState(() => {
    // Initialize with localStorage fallback
    return getItem('theme', 'monastic');
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from Supabase (all users are authenticated)
  useEffect(() => {
    const loadTheme = async () => {
      if (!user?.id) {
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
          setItem('theme', data.theme); // Update localStorage
        } else {
          // No theme in Supabase, use localStorage fallback and save to database
          const localTheme = getItem('theme', 'monastic');
          setThemeState(localTheme);
          
          // Save the default theme to database if no theme exists
          try {
            const { error: saveError } = await supabase
              .from('progress')
              .upsert({
                user_id: user.id,
                theme: localTheme,
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'user_id'
              });

            if (saveError) {
              console.error('Error saving default theme:', saveError);
            }
          } catch (saveError) {
            console.error('Error saving default theme:', saveError);
          }
        }
      } catch (error) {
        console.error('Error loading theme:', error);
        // Fallback to localStorage
        const localTheme = getItem('theme', 'monastic');
        setThemeState(localTheme);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, [user?.id]); // Only reload when user ID changes, not on every auth refresh

  // Save theme to Supabase and localStorage when it changes
  const setTheme = async (newTheme) => {
    setThemeState(newTheme);
    setItem('theme', newTheme); // Always update localStorage

    if (!user) return; // All users must be authenticated

    try {
      const { error } = await supabase
        .from('progress')
        .upsert({
          user_id: user.id,
          theme: newTheme,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
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