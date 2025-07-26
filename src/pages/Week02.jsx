import React, { useEffect } from 'react';
import Header from '../components/Header';
import JournalTextarea from '../components/JournalTextarea';
import Button from '../components/Button';
import { useAppContext } from '../context/AppContext';
import weeklyContent from '../data/weeklyContent';

const weekData = weeklyContent.find(w => w.week === 2) || { title: 'Week 2', practices: [], reflectionPrompts: [] };

const Week02 = () => {
  const {
    completeWeek,
    setCurrentWeek,
    currentWeek,
    completedWeeks,
  } = useAppContext();

  useEffect(() => {
    if (currentWeek < 2) setCurrentWeek(2);
  }, [currentWeek, setCurrentWeek]);

  const handleComplete = () => {
    completeWeek(2);
    if (currentWeek === 2) setCurrentWeek(3);
  };

  return (
    <div className="min-h-screen bg-background text-primary font-serif">
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
        <JournalTextarea weekNumber="2" />
        <Button
          className="mt-4"
          onClick={handleComplete}
          disabled={completedWeeks.includes(2)}
        >
          {completedWeeks.includes(2) ? 'Completed' : 'Mark as Complete'}
        </Button>
      </div>
    </div>
  );
};

export default Week02; 