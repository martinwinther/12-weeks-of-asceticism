import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const AccountSettingsPage = () => {
  const { user, deleteAccount, signOut } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [error, setError] = useState('');

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
              <h3 className="text-lg font-medium mb-2 text-destructive">Data Management</h3>
              <p className="text-muted mb-3">
                Sign out and clear all local data. This action cannot be undone.
              </p>
              
              {!showDeleteConfirmation ? (
                <Button 
                  onClick={() => setShowDeleteConfirmation(true)}
                  variant="destructive"
                  className="w-full sm:w-auto"
                >
                  Sign Out & Clear Data
                </Button>
              ) : (
                <div className="space-y-4 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                                <div className="space-y-2">
                <p className="text-sm font-medium text-destructive">
                  ⚠️ This action is irreversible
                </p>
                <p className="text-sm text-muted">
                  This will sign you out and clear all local data. For complete account deletion including server-side data, please contact support.
                </p>
              </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Type <span className="font-mono bg-muted px-1 rounded">DELETE</span> to confirm:
                    </label>
                    <input
                      type="text"
                      value={confirmationText}
                      onChange={(e) => setConfirmationText(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                      placeholder="DELETE"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      onClick={handleDeleteAccount}
                      variant="destructive"
                      disabled={isDeleting || confirmationText !== 'DELETE'}
                      className="flex-1"
                    >
                      {isDeleting ? 'Signing Out...' : 'Sign Out & Clear Data'}
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
