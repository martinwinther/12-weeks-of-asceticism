import React from 'react';
import { useAppContext } from '../context/AppContext';

const JournalTextarea = ({ weekNumber }) => {
  const { getJournalEntry, setJournalEntry } = useAppContext();
  
  const handleChange = (e) => {
    setJournalEntry(weekNumber, e.target.value);
  };

  return (
    <textarea
      className="w-full min-h-[200px] p-4 bg-white rounded border border-slate-300 shadow-sm font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
      value={getJournalEntry(weekNumber)}
      onChange={handleChange}
      placeholder={`Write your reflections for Week ${weekNumber}…`}
    />
  );
};

export default JournalTextarea; 