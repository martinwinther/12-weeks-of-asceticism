import React from 'react';

const WeeklyTeachings = ({ weekNumber, teachings }) => {
  // Handle cases where teachings data is missing or incomplete
  if (!teachings) {
    return null;
  }

  const { ancient, modern } = teachings;
  
  // Only render if we have at least one teaching
  if (!ancient && !modern) {
    return null;
  }

  return (
    <div className="mb-8 md:mb-12">
      <h3 className="text-lg md:text-xl font-medium text-primary mb-4 md:mb-6">
        Weekly Wisdom
      </h3>
      <div className="space-y-4 md:space-y-6">
        {/* Ancient Teaching */}
        {ancient && (
          <div className="bg-white rounded-lg p-4 md:p-6 border-l-4 border-primary/60 shadow-sm border border-accent/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-primary/60 rounded-full"></div>
              <span className="text-xs font-medium text-primary/80 uppercase tracking-wide">
                Ancient Wisdom
              </span>
            </div>
            <blockquote className="text-primary font-serif text-base md:text-lg leading-relaxed mb-3 italic">
              "{ancient.quote}"
            </blockquote>
            <cite className="text-sm text-accent">
              — {ancient.author},{' '}
              <a 
                href={ancient.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-accent transition-colors underline decoration-dotted"
              >
                {ancient.source}
              </a>
            </cite>
          </div>
        )}

        {/* Modern Teaching */}
        {modern && (
          <div className="bg-white rounded-lg p-4 md:p-6 border-l-4 border-accent/60 shadow-sm border border-accent/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-accent/60 rounded-full"></div>
              <span className="text-xs font-medium text-accent/80 uppercase tracking-wide">
                Modern Insight
              </span>
            </div>
            <blockquote className="text-primary font-serif text-base md:text-lg leading-relaxed mb-3 italic">
              "{modern.quote}"
            </blockquote>
            <cite className="text-sm text-accent">
              — {modern.author},{' '}
              <a 
                href={modern.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-accent transition-colors underline decoration-dotted"
              >
                {modern.source}
              </a>
            </cite>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyTeachings; 