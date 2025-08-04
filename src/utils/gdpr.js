// GDPR Compliance Utilities

/**
 * Get current cookie consent status
 * @returns {Object|null} Consent object or null if no consent given
 */
export const getCookieConsent = () => {
  try {
    const consent = localStorage.getItem('cookie-consent');
    return consent ? JSON.parse(consent) : null;
  } catch (error) {
    console.error('Error reading cookie consent:', error);
    return null;
  }
};

/**
 * Check if user has given consent for specific cookie type
 * @param {string} cookieType - 'necessary', 'analytics', or 'marketing'
 * @returns {boolean}
 */
export const hasConsent = (cookieType) => {
  const consent = getCookieConsent();
  if (!consent) return false;
  
  return consent[cookieType] === true;
};

/**
 * Check if analytics cookies are allowed
 * @returns {boolean}
 */
export const canUseAnalytics = () => {
  return hasConsent('analytics');
};

/**
 * Check if marketing cookies are allowed
 * @returns {boolean}
 */
export const canUseMarketing = () => {
  return hasConsent('marketing');
};

/**
 * Initialize analytics only if consent is given
 * @param {Function} analyticsInit - Analytics initialization function
 */
export const initializeAnalytics = (analyticsInit) => {
  if (canUseAnalytics()) {
    try {
      analyticsInit();
    } catch (error) {
      console.error('Error initializing analytics:', error);
    }
  }
};

/**
 * Process data according to GDPR requirements
 * @param {Object} data - Data to process
 * @param {string} purpose - Purpose of processing
 * @returns {Object} Processed data with GDPR compliance
 */
export const processDataForGDPR = (data, purpose) => {
  const processedData = {
    ...data,
    processingPurpose: purpose,
    processedAt: new Date().toISOString(),
    dataSubjectRights: {
      access: true,
      rectification: true,
      erasure: true,
      portability: true,
      restriction: true,
      objection: true
    }
  };

  return processedData;
};

/**
 * Anonymize personal data for analytics
 * @param {Object} data - Data to anonymize
 * @returns {Object} Anonymized data
 */
export const anonymizeData = (data) => {
  const anonymized = { ...data };
  
  // Remove or hash personal identifiers
  if (anonymized.email) {
    anonymized.email = anonymized.email.split('@')[0] + '@***.***';
  }
  
  if (anonymized.userId) {
    anonymized.userId = 'user_' + anonymized.userId.slice(-4);
  }
  
  if (anonymized.ip) {
    anonymized.ip = anonymized.ip.split('.').slice(0, 3).join('.') + '.***';
  }
  
  return anonymized;
};

/**
 * Generate data export for GDPR Article 20 (Right to Data Portability)
 * @param {Object} userData - User's personal data
 * @returns {Object} Structured data export
 */
export const generateDataExport = (userData) => {
  return {
    exportDate: new Date().toISOString(),
    dataSubject: {
      id: userData.id,
      email: userData.email,
      createdAt: userData.created_at
    },
    personalData: {
      profile: {
        email: userData.email,
        createdAt: userData.created_at,
        lastSignIn: userData.last_sign_in_at
      },
      progress: userData.progress || [],
      journalEntries: userData.journal_entries || [],
      preferences: userData.preferences || {}
    },
    processingActivities: [
      {
        purpose: 'Account Management',
        legalBasis: 'Contract',
        retentionPeriod: 'Until account deletion'
      },
      {
        purpose: 'Service Provision',
        legalBasis: 'Contract',
        retentionPeriod: 'Until account deletion'
      }
    ],
    dataRights: {
      access: 'You can request a copy of your data',
      rectification: 'You can correct inaccurate data',
      erasure: 'You can request account deletion',
      portability: 'You can export your data',
      restriction: 'You can limit data processing',
      objection: 'You can object to processing'
    }
  };
};

/**
 * Validate GDPR compliance of data processing
 * @param {Object} processingActivity - Processing activity to validate
 * @returns {Object} Validation result
 */
export const validateGDPRCompliance = (processingActivity) => {
  const required = ['purpose', 'legalBasis', 'retentionPeriod'];
  const missing = required.filter(field => !processingActivity[field]);
  
  return {
    compliant: missing.length === 0,
    missingFields: missing,
    recommendations: missing.length > 0 ? 
      `Add missing fields: ${missing.join(', ')}` : 
      'Processing activity is GDPR compliant'
  };
};

/**
 * Check if data retention period has expired
 * @param {string} createdAt - Data creation timestamp
 * @param {number} retentionDays - Retention period in days
 * @returns {boolean}
 */
export const isRetentionExpired = (createdAt, retentionDays) => {
  const created = new Date(createdAt);
  const now = new Date();
  const daysDiff = (now - created) / (1000 * 60 * 60 * 24);
  
  return daysDiff > retentionDays;
};

/**
 * Log GDPR compliance events
 * @param {string} event - Event type
 * @param {Object} data - Event data
 */
export const logGDPREvent = (event, data = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    data,
    gdprCompliant: true
  };
  
  // In production, this would be sent to a secure logging service
  console.log('GDPR Event:', logEntry);
}; 