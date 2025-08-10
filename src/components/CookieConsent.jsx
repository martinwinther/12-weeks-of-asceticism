import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
    setIsLoading(false);
  }, []);

  const handleAcceptAll = () => {
    const consent = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    setShowBanner(false);
  };

  const handleAcceptSelected = () => {
    const consent = {
      ...preferences,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    setShowBanner(false);
  };

  if (isLoading) return null;
  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-accent/20 p-4 z-50 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-primary mb-2">
              We value your privacy
            </h3>
            <p className="text-sm text-accent mb-4">
              We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. 
              You can choose which cookies to allow. For more information, see our{' '}
              <a href="/privacy" className="text-primary underline hover:text-primary/80">
                Privacy Policy
              </a>.
            </p>
            
            <div className="space-y-3 mb-4">
              <div className={`flex items-center justify-between p-3 rounded-lg border ${
                preferences.necessary ? 'border-primary/30 bg-primary/5' : 'border-accent/20'
              }`}>
                <div>
                  <span className="text-sm font-medium text-primary">Necessary cookies</span>
                  <p className="text-xs text-accent/80">Required for the website to function properly</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.necessary}
                    disabled
                    className="w-4 h-4 text-primary bg-background border-2 border-accent/60 rounded focus:ring-primary cursor-not-allowed opacity-50"
                  />
                </div>
              </div>
              
              <div className={`flex items-center justify-between p-3 rounded-lg border ${
                preferences.analytics ? 'border-primary/30 bg-primary/5' : 'border-accent/20'
              }`}>
                <div>
                  <span className="text-sm font-medium text-primary">Analytics cookies</span>
                  <p className="text-xs text-accent/80">Help us understand how visitors interact with our website</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                    className="w-4 h-4 text-primary bg-background border-2 border-accent/60 rounded focus:ring-primary cursor-pointer hover:border-accent/80 transition-colors"
                  />
                </div>
              </div>
              
              <div className={`flex items-center justify-between p-3 rounded-lg border ${
                preferences.marketing ? 'border-primary/30 bg-primary/5' : 'border-accent/20'
              }`}>
                <div>
                  <span className="text-sm font-medium text-primary">Marketing cookies</span>
                  <p className="text-xs text-accent/80">Used to deliver personalized content and advertisements</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                    className="w-4 h-4 text-primary bg-background border-2 border-accent/60 rounded focus:ring-primary cursor-pointer hover:border-accent/80 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleRejectAll}
              className="px-4 py-2 text-sm text-accent border border-accent/30 rounded hover:bg-accent/10 transition-colors"
            >
              Reject All
            </button>
            <button
              onClick={handleAcceptSelected}
              className="px-4 py-2 text-sm bg-accent/10 text-primary border border-accent/30 rounded hover:bg-accent/20 transition-colors"
            >
              Accept Selected ({[preferences.analytics, preferences.marketing].filter(Boolean).length} selected)
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 text-sm bg-primary text-background rounded hover:bg-primary/90 transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent; 