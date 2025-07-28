import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background font-serif">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-accent">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background font-serif text-primary">
      <h1 className="text-4xl mb-4 font-bold">12 Weeks of Asceticism</h1>
      <p className="mb-8 max-w-xl text-center text-lg text-accent">
        Welcome to your minimalist journey. Each week, unlock new practices and reflect on your progress. Embrace simplicity, discipline, and self-discovery.
      </p>
      <p className="mb-8 max-w-md text-center text-base text-accent/80">
        Enter your email to get started. We'll send you a secure link to access your account.
      </p>
      <Button onClick={() => navigate('/auth')}>Get Started</Button>
    </div>
  );
};

export default LandingPage; 