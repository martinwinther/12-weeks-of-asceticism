import DOMPurify from 'dompurify';

// Sanitize text input to prevent XSS attacks
export const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  // Configure DOMPurify to only allow plain text
  const clean = DOMPurify.sanitize(text, { 
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false
  });
  
  // Additional length limit for security (50KB max)
  const MAX_LENGTH = 50000;
  if (clean.length > MAX_LENGTH) {
    throw new Error(`Text exceeds maximum length of ${MAX_LENGTH} characters`);
  }
  
  return clean.trim();
};

// Validate text input
export const validateText = (text) => {
  if (!text) return true; // Empty text is valid
  
  if (typeof text !== 'string') {
    return { isValid: false, error: 'Text must be a string' };
  }
  
  if (text.length > 50000) {
    return { isValid: false, error: 'Text is too long (max 50,000 characters)' };
  }
  
  return { isValid: true };
}; 