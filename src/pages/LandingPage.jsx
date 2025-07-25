import React from 'react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background font-serif text-primary">
      <h1 className="text-4xl mb-4 font-bold">12 Weeks of Asceticism</h1>
      <p className="mb-8 max-w-xl text-center text-lg">
        Welcome to your minimalist journey. Each week, unlock new practices and reflect on your progress. Embrace simplicity, discipline, and self-discovery.
      </p>
      <Button onClick={() => navigate('/dashboard')}>Start My Ascetic Journey</Button>
    </div>
  );
};

export default LandingPage; 