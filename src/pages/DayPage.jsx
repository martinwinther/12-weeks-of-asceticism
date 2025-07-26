import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import JournalTextarea from '../components/JournalTextarea';
import { useAppContext } from '../context/AppContext';
import program from '../data/program';

const DayPage = () => {
  const { day } = useParams();
  const dayNumber = parseInt(day);
  const { currentDay, setCurrentDay } = useAppContext();
  
  // Update current day if this day is accessible
  useEffect(() => {
    if (dayNumber >= currentDay && dayNumber <= 84) {
      setCurrentDay(dayNumber);
    }
  }, [dayNumber, currentDay, setCurrentDay]);
  
  // Compute current week (0-indexed)
  const currentWeek = Math.floor((dayNumber - 1) / 7);
  
  // Get active actions (all weeks up to and including current week)
  const activeActions = program.slice(0, currentWeek + 1);
  
  // Get current prompt
  const currentPrompt = program[currentWeek]?.prompt || '';
  
  // Validation
  if (dayNumber < 1 || dayNumber > 84) {
    return (
      <div className="min-h-screen bg-background text-primary font-serif">
        <Header title="Invalid Day" />
        <div className="max-w-2xl mx-auto p-6">
          <p className="text-center text-lg">Please choose a day between 1 and 84.</p>
        </div>
      </div>
    );
  }

  // Check if day is accessible (not in the future)
  if (dayNumber > currentDay) {
    return (
      <div className="min-h-screen bg-background text-primary font-serif">
        <Header title={`Day ${dayNumber}`} />
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-lg mb-4">This day is not yet available.</p>
            <p className="text-accent">Complete Day {currentDay} first to unlock future days.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-primary font-serif">
      <Header title={`Day ${dayNumber}`} />
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        
        {/* Active Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Active Practices</h2>
          <div className="space-y-4">
            {activeActions.map((week) => (
              <div key={week.week} className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold text-lg">Week {week.week}: {week.title}</h3>
                <p className="text-accent text-sm mb-2">{week.description}</p>
                <ul className="list-disc list-inside space-y-1">
                  {week.details.map((detail, index) => (
                    <li key={index} className="text-sm">{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Journaling Prompt */}
        {currentPrompt && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Today's Reflection</h2>
            <div className="bg-accent/10 p-4 rounded-md mb-4">
              <p className="text-primary font-medium">{currentPrompt}</p>
            </div>
            <JournalTextarea weekNumber={dayNumber.toString()} />
          </div>
        )}

      </div>
    </div>
  );
};

export default DayPage; 