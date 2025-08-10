import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { user, signIn } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email address');
      setIsLoading(false);
      return;
    }

    const result = await signIn(email);
    
    if (result.success) {
      setMessage('Check your email for a magic link to access your account!');
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome to 12 Weeks of Asceticism
          </h1>
          <p className="text-accent">
            Enter your email to sign in or create an account
          </p>
        </div>

        <div className="bg-surface p-8 rounded-xl shadow-lg border border-accent">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-accent rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors touch-manipulation bg-background text-primary placeholder:text-muted"
                disabled={isLoading}
                autoComplete="email"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </div>

            {error && (
              <div className="p-3 bg-error border border-error rounded-lg">
                <p className="text-error text-sm">{error}</p>
              </div>
            )}

            {message && (
              <div className="p-3 bg-success border border-success rounded-lg">
                <p className="text-success text-sm">{message}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={isLoading}
              loadingText="Sending Magic Link..."
            >
              Send Magic Link
            </Button>
          </form>

          <div className="mt-6 text-center">
            <div className="text-xs text-muted space-y-1">
              <p>We'll email you a secure link to sign in or create your account.</p>
              <p>No password required!</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-accent hover:text-primary transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 