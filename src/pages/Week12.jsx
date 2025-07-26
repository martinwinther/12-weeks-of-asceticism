import React, { useEffect } from 'react';
import Header from '../components/Header';
import JournalTextarea from '../components/JournalTextarea';
import Button from '../components/Button';
import { useAppContext } from '../context/AppContext';
import weeklyContent from '../data/weeklyContent';

const weekData = weeklyContent.find(w => w.week === 12);

const Week12 = () => {
  const {
    journalEntries,
    setJournalEntry,
    completeWeek,
    setCurrentWeek,
    currentWeek,
    completedWeeks,
  } = useAppContext();

  useEffect(() => {
    if (currentWeek < 12) setCurrentWeek(12);
  }, [currentWeek, setCurrentWeek]);

  const handleJournalChange = (e) => {
    setJournalEntry('12', e.target.value);
  };

  const handleComplete = () => {
    completeWeek(12);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-serif">
      <Header title={weekData.title} />
      <div className="max-w-xl mx-auto p-6">
        <h2 className="text-lg font-bold mb-2">Practices</h2>
        <ul className="mb-6 list-disc list-inside">
          {weekData.practices.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
        <h2 className="text-lg font-bold mb-2">Reflection Prompts</h2>
        <ul className="mb-6 list-disc list-inside">
          {weekData.reflectionPrompts.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
        <h2 className="text-lg font-bold mb-2">Your Journal</h2>
        <JournalTextarea
          value={journalEntries['12'] || ''}
          onChange={handleJournalChange}
          placeholder="Write your reflections here..."
        />
        <Button
          className="mt-4"
          onClick={handleComplete}
          disabled={completedWeeks.includes(12)}
        >
          {completedWeeks.includes(12) ? 'Completed' : 'Mark as Complete'}
        </Button>
      </div>
    </div>
  );
};

export default Week12; 