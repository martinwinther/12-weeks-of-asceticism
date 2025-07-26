import React, { useEffect } from 'react';
import Header from '../components/Header';
import JournalTextarea from '../components/JournalTextarea';
import Button from '../components/Button';
import { useAppContext } from '../context/AppContext';
import weeklyContent from '../data/weeklyContent';

const weekData = weeklyContent.find(w => w.week === 1);

const Week01 = () => {
  const {
    journalEntries,
    setJournalEntry,
    completeWeek,
    setCurrentWeek,
    currentWeek,
    completedWeeks,
  } = useAppContext();

  useEffect(() => {
    if (currentWeek < 1) setCurrentWeek(1);
  }, [currentWeek, setCurrentWeek]);

  const handleJournalChange = (e) => {
    setJournalEntry('1', e.target.value);
  };

  const handleComplete = () => {
    completeWeek(1);
    if (currentWeek === 1) setCurrentWeek(2);
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
          value={journalEntries['1'] || ''}
          onChange={handleJournalChange}
          placeholder="Write your reflections here..."
        />
        <Button
          className="mt-4"
          onClick={handleComplete}
          disabled={completedWeeks.includes(1)}
        >
          {completedWeeks.includes(1) ? 'Completed' : 'Mark as Complete'}
        </Button>
      </div>
    </div>
  );
};

export default Week01; 