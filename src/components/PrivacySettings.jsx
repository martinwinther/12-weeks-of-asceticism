import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const PrivacySettings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleDataExport = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      // This would typically make an API call to export user data
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessage('Data export request submitted. You will receive an email with your data within 30 days.');
    } catch (error) {
      setMessage('Error requesting data export. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountDeletion = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    setMessage('');
    
    try {
      // This would typically make an API call to delete the account
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessage('Account deletion request submitted. Your account will be deleted within 30 days.');
    } catch (error) {
      setMessage('Error requesting account deletion. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCookiePreferences = () => {
    // Clear existing consent and show cookie banner again
    localStorage.removeItem('cookie-consent');
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-primary mb-4">Privacy Settings</h2>
        <p className="text-accent mb-6">
          Manage your privacy preferences and exercise your GDPR rights.
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('Error') 
            ? 'bg-red-100 text-red-800 border border-red-200' 
            : 'bg-green-100 text-green-800 border border-green-200'
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        {/* Cookie Preferences */}
        <div className="bg-background border border-accent/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary mb-2">Cookie Preferences</h3>
          <p className="text-sm text-accent mb-4">
            Manage your cookie settings. You can change your preferences at any time.
          </p>
          <Button 
            onClick={handleCookiePreferences}
            disabled={isLoading}
            className="bg-accent/10 text-primary border border-accent/30 hover:bg-accent/20"
          >
            Update Cookie Preferences
          </Button>
        </div>

        {/* Data Export */}
        <div className="bg-background border border-accent/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary mb-2">Data Export</h3>
          <p className="text-sm text-accent mb-4">
            Request a copy of all your personal data in a structured, machine-readable format.
            This is your right under GDPR Article 20 (Right to Data Portability).
          </p>
          <Button 
            onClick={handleDataExport}
            disabled={isLoading}
            className="bg-accent/10 text-primary border border-accent/30 hover:bg-accent/20"
          >
            {isLoading ? 'Requesting...' : 'Request Data Export'}
          </Button>
        </div>

        {/* Account Deletion */}
        <div className="bg-background border border-accent/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary mb-2">Account Deletion</h3>
          <p className="text-sm text-accent mb-4">
            Request permanent deletion of your account and all associated data. 
            This action cannot be undone. This is your right under GDPR Article 17 (Right to Erasure).
          </p>
          <Button 
            onClick={handleAccountDeletion}
            disabled={isLoading}
            className="bg-red-100 text-red-800 border border-red-200 hover:bg-red-200"
          >
            {isLoading ? 'Requesting...' : 'Request Account Deletion'}
          </Button>
        </div>

        {/* Contact Information */}
        <div className="bg-background border border-accent/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary mb-2">Contact Us</h3>
          <p className="text-sm text-accent mb-4">
            For any privacy-related questions or to exercise your GDPR rights, please contact us:
          </p>
          <div className="space-y-2 text-sm">
            <p><strong>Email:</strong> privacy@12weeksofasceticism.com</p>
            <p><strong>Response Time:</strong> We will respond to your request within 30 days</p>
          </div>
        </div>

        {/* Additional Rights */}
        <div className="bg-background border border-accent/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary mb-2">Your GDPR Rights</h3>
          <div className="space-y-3 text-sm text-accent">
            <div>
              <strong className="text-primary">Right of Access:</strong> You can request information about what personal data we hold about you.
            </div>
            <div>
              <strong className="text-primary">Right to Rectification:</strong> You can request correction of inaccurate or incomplete data.
            </div>
            <div>
              <strong className="text-primary">Right to Restrict Processing:</strong> You can request that we limit how we use your data.
            </div>
            <div>
              <strong className="text-primary">Right to Object:</strong> You can object to processing based on legitimate interests.
            </div>
            <div>
              <strong className="text-primary">Right to Withdraw Consent:</strong> You can withdraw consent for cookie-based processing.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings; 