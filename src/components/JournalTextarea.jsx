import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const JournalTextarea = ({ weekNumber }) => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing journal entry on mount
  useEffect(() => {
    const loadJournalEntry = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('journals')
          .select('text, updated_at')
          .eq('user_id', user.id)
          .eq('day_number', weekNumber)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Error loading journal entry:', error);
        } else if (data) {
          setText(data.text || '');
        }
      } catch (error) {
        console.error('Error loading journal entry:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadJournalEntry();
  }, [user, weekNumber]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (handleChange.timeoutId) {
        clearTimeout(handleChange.timeoutId);
      }
    };
  }, []);

  // Save journal entry to Supabase
  const saveJournalEntry = async (newText) => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('journals')
        .upsert({
          user_id: user.id,
          day_number: weekNumber,
          text: newText,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving journal entry:', error);
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    
    // Debounce the save operation
    if (handleChange.timeoutId) {
      clearTimeout(handleChange.timeoutId);
    }
    
    handleChange.timeoutId = setTimeout(() => {
      saveJournalEntry(newText);
    }, 1000); // Save 1 second after user stops typing
  };

  if (!user) {
    return (
      <div className="w-full min-h-[200px] p-4 bg-gray-50 rounded border border-gray-200 flex items-center justify-center">
        <p className="text-gray-500">Please sign in to write journal entries</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <textarea
        className="w-full min-h-[200px] p-4 bg-white rounded border border-slate-300 shadow-sm font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
        value={text}
        onChange={handleChange}
        placeholder={`Write your reflections for Week ${weekNumber}…`}
        disabled={isLoading}
      />
      {(isLoading || isSaving) && (
        <div className="absolute top-2 right-2">
          <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
        </div>
      )}
      {!isLoading && !isSaving && (
        <p className="text-xs text-gray-500 mt-1">
          Auto-saved to cloud
        </p>
      )}
    </div>
  );
};

export default JournalTextarea; 