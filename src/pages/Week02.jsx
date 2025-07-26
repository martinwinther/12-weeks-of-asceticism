import React, { useEffect } from 'react';
import Header from '../components/Header';
import JournalTextarea from '../components/JournalTextarea';
import Button from '../components/Button';
import { useAppContext } from '../context/AppContext';
import program from '../data/program';

const weekData = program.find(w => w.week === 2);

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
      <Header title={`Week 2: ${weekData.title}`} />
      <div className="max-w-xl mx-auto p-6">
        <div className="mb-4">
          <p className="text-accent mb-4">{weekData.description}</p>
        </div>
        <h2 className="text-lg font-bold mb-2">Practices</h2>
        <ul className="mb-6 list-disc list-inside">
          {weekData.details.map((detail, i) => (
            <li key={i}>{detail}</li>
          ))}
        </ul>
        <h2 className="text-lg font-bold mb-2">Reflection Prompt</h2>
        <div className="mb-6 bg-accent/10 p-4 rounded">
          <p>{weekData.prompt}</p>
        </div>
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