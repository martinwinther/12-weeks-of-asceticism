import React from 'react';
import Header from '../components/Header';
import ProgressTracker from '../components/ProgressTracker';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Dashboard = () => {
  const { currentWeek, completedWeeks } = useAppContext();
  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-serif">
      <Header title="Your Dashboard" />
      <div className="max-w-xl mx-auto p-6">
        <ProgressTracker currentWeek={currentWeek} completedWeeks={completedWeeks} />
        <h2 className="text-xl font-bold mb-4 mt-8">Weeks</h2>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(12)].map((_, i) => {
            const week = i + 1;
            const isUnlocked = week <= currentWeek;
            return (
              <Link
                key={week}
                to={isUnlocked ? `/week${week.toString().padStart(2, '0')}` : '#'}
                className={`block p-4 rounded border text-center font-mono transition
                  ${isUnlocked ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-white text-slate-500 border-slate-300 opacity-50 cursor-not-allowed'}`}
                tabIndex={isUnlocked ? 0 : -1}
                aria-disabled={!isUnlocked}
              >
                Week {week}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 