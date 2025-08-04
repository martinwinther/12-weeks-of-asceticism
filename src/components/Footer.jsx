import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-accent/20 py-6 mt-auto">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-accent">
            <p>&copy; {new Date().getFullYear()} 12 Weeks of Asceticism. All rights reserved.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
            <Link 
              to="/privacy" 
              className="text-accent hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <a 
              href="mailto:privacy@12weeksofasceticism.com" 
              className="text-accent hover:text-primary transition-colors"
            >
              Contact
            </a>
            <span className="text-accent/60">
              GDPR Compliant
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 