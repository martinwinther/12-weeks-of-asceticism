import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

const AccountSettingsPage = () => {
  const { user, deleteAccount, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [error, setError] = useState('');

  // Show loading state while authentication is being processed
  if (loading) {
    return <LoadingSpinner fullScreen size="lg" text="Loading account settings..." />;
  }

  const handleDeleteAccount = async () => {
    if (confirmationText !== 'DELETE') {
      setError('Please type DELETE exactly as shown to confirm account deletion.');
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      const result = await deleteAccount();
      
      if (result.success) {
        // Redirect to landing page after successful deletion
        navigate('/', { replace: true });
      } else {
        setError(result.error || 'Failed to delete account. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      navigate('/', { replace: true });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted">You must be logged in to access account settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
          <p className="text-muted">Manage your account and privacy settings</p>
        </div>

        {/* Account Information */}
        <div className="bg-card rounded-lg p-6 mb-6 border">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Email</label>
              <p className="text-foreground">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Account Created</label>
              <p className="text-foreground">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-card rounded-lg p-6 mb-6 border">
          <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Sign Out</h3>
              <p className="text-muted mb-3">Sign out of your account on this device</p>
              <Button 
                onClick={handleSignOut}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Sign Out
              </Button>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-2 text-red-600"> Data Management</h3>
              <p className="text-muted mb-3">
                This will permanently delete all your data and sign you out. This action cannot be undone.
              </p>
              
              {!showDeleteConfirmation ? (
                <Button 
                  onClick={() => setShowDeleteConfirmation(true)}
                  variant="destructive"
                  className="w-full sm:w-auto"
                >
                 Delete All Data & Sign Out
                </Button>
              ) : (
                <div className="space-y-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-red-700 dark:text-red-300">
                      ⚠️ FINAL WARNING: This action is PERMANENT
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      This will immediately sign you out and permanently delete all your data including:
                    </p>
                    <ul className="text-sm text-red-600 dark:text-red-400 ml-4 list-disc">
                      <li>All journal entries</li>
                      <li>Progress tracking data</li>
                      <li>Settings and preferences</li>
                      
                    </ul>
                    <p className="text-sm font-medium text-red-700 dark:text-red-300">
                      This action cannot be undone.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-red-700 dark:text-red-300">
                      Type <span className="font-mono bg-red-100 dark:bg-red-800 px-2 py-1 rounded border">DELETE</span> to confirm:
                    </label>
                    <input
                      type="text"
                      value={confirmationText}
                      onChange={(e) => setConfirmationText(e.target.value)}
                      className="w-full px-3 py-2 border border-red-300 dark:border-red-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="DELETE"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      onClick={handleDeleteAccount}
                      variant="destructive"
                      loading={isDeleting}
                      loadingText="Deleting Data..."
                      disabled={confirmationText !== 'DELETE'}
                      className="flex-1"
                    >
                      PERMANENTLY DELETE ALL DATA
                    </Button>
                    <Button 
                      onClick={() => {
                        setShowDeleteConfirmation(false);
                        setConfirmationText('');
                        setError('');
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPage;
