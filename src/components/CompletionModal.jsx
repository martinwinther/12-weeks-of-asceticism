import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

const CompletionModal = ({ isOpen, onClose }) => {
  const { state } = useAppContext();
  const { theme } = useTheme();
  const [isCopied, setIsCopied] = useState(false);
  const cardRef = useRef(null);

  const calculateStatistics = () => {
    // Calculate actually completed days based on practices + journal
    const completedDays = Array.from({ length: 84 }, (_, i) => i + 1).filter(day => {
      const dayKey = day.toString();
      const weekNumber = Math.ceil(day / 7);
      
      // Check if all required practices are completed
      const dayPractices = state.practiceCompletions[dayKey] || {};
      const requiredWeeks = Array.from({ length: weekNumber }, (_, i) => i + 1);
      const completedPractices = requiredWeeks.filter(week => dayPractices[`week${week}`]);
      
      // Check journal completion
      const hasJournal = state.journalEntries[dayKey]?.trim().length > 0;
      
      return completedPractices.length === requiredWeeks.length && hasJournal;
    });
    
    const journalEntries = Object.keys(state.journalEntries).filter(
      key => state.journalEntries[key]?.trim().length > 0
    );
    
    const totalWords = journalEntries.reduce((sum, key) => {
      const words = state.journalEntries[key].trim().split(/\s+/).length;
      return sum + words;
    }, 0);

    // Calculate total practices completed across all days
    let totalPracticesCompleted = 0;
    for (let day = 1; day <= 84; day++) {
      const weekNumber = Math.ceil(day / 7);
      const dayKey = day.toString();
      const dayPractices = state.practiceCompletions[dayKey] || {};
      
      for (let week = 1; week <= weekNumber; week++) {
        if (dayPractices[`week${week}`]) {
          totalPracticesCompleted++;
        }
      }
    }

    // Calculate days since start
    const startDate = new Date(state.startDate);
    const endDate = new Date();
    const daysSinceStart = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    return {
      completedDays: completedDays.length,
      journalEntries: journalEntries.length,
      totalWords,
      averageWords: journalEntries.length > 0 ? Math.round(totalWords / journalEntries.length) : 0,
      totalPracticesCompleted,
      daysSinceStart,
      startDate: startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      endDate: endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    };
  };

  const stats = calculateStatistics();

  const shareableText = `I just finished the 84-day ascetic practice program! 🎉

📅 ${stats.completedDays}/84 days completed
✍️ ${stats.journalEntries} journal entries written
📝 ${stats.totalWords.toLocaleString()} words journaled
🏋️ ${stats.totalPracticesCompleted} practices completed

Start your own journey at 12weeksofasceticism.com`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareableText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '12 Weeks of Asceticism - Journey Completed!',
          text: shareableText,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      handleCopyText();
    }
  };

  const handleDownloadStats = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 1200;
    canvas.height = 630;

    // Background gradient based on theme
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    if (theme === 'monastic') {
      gradient.addColorStop(0, '#f0ebe0');
      gradient.addColorStop(1, '#e8dfd0');
      ctx.fillStyle = gradient;
    } else if (theme === 'dark') {
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(1, '#1e293b');
      ctx.fillStyle = gradient;
    } else {
      gradient.addColorStop(0, '#f8fafc');
      gradient.addColorStop(1, '#ffffff');
      ctx.fillStyle = gradient;
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set text color based on theme
    const textColor = theme === 'dark' ? '#f1f5f9' : theme === 'monastic' ? '#2a1f15' : '#334155';
    const accentColor = theme === 'dark' ? '#cbd5e1' : theme === 'monastic' ? '#5d4e3a' : '#64748b';

    // Title
    ctx.fillStyle = textColor;
    ctx.font = 'bold 64px serif';
    ctx.textAlign = 'center';
    ctx.fillText('84-Day Journey', canvas.width / 2, 100);

    // Subtitle
    ctx.font = '32px serif';
    ctx.fillStyle = accentColor;
    ctx.fillText('Ascetic Practice', canvas.width / 2, 160);

    // Stats section
    const statsY = 250;
    const statsGap = 120;
    const statsList = [
      { label: 'Days', value: stats.completedDays },
      { label: 'Entries', value: stats.journalEntries },
      { label: 'Words', value: stats.totalWords.toLocaleString() },
      { label: 'Practices', value: stats.totalPracticesCompleted },
    ];

    statsList.forEach((stat, index) => {
      const x = 200 + (index * 250);
      ctx.fillStyle = textColor;
      ctx.font = 'bold 56px serif';
      ctx.textAlign = 'center';
      ctx.fillText(stat.value, x, statsY);
      
      ctx.fillStyle = accentColor;
      ctx.font = '24px serif';
      ctx.fillText(stat.label, x, statsY + 40);
    });

    // Journey period
    ctx.fillStyle = accentColor;
    ctx.font = '24px serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${stats.startDate} - ${stats.endDate}`, canvas.width / 2, 500);

    // Footer
    ctx.fillStyle = textColor;
    ctx.font = '28px serif';
    ctx.fillText('12weeksofasceticism.com', canvas.width / 2, 580);

    // Convert to blob and download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'journey-complete.png';
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    });
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-surface rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-accent/20 relative" style={{backgroundColor: theme === 'dark' ? '#1e293b' : undefined}}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-accent hover:text-primary transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="p-6 md:p-8 pt-12">
          {/* Journey Period */}
          <div className="text-center mb-8 pb-6 border-b border-accent/20">
            <p className="text-accent text-sm mb-1">Your Journey</p>
            <p className="text-primary font-medium">{stats.startDate} - {stats.endDate}</p>
            <p className="text-accent text-sm mt-1">{stats.daysSinceStart} days</p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8">
            <div className="bg-background rounded-lg p-4 md:p-6 text-center border border-accent/20" style={{backgroundColor: theme === 'dark' ? '#0f172a' : undefined}}>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stats.completedDays}
              </div>
              <div className="text-accent text-sm">Days Completed</div>
            </div>

            <div className="bg-background rounded-lg p-4 md:p-6 text-center border border-accent/20" style={{backgroundColor: theme === 'dark' ? '#0f172a' : undefined}}>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stats.journalEntries}
              </div>
              <div className="text-accent text-sm">Journal Entries</div>
            </div>

            <div className="bg-background rounded-lg p-4 md:p-6 text-center border border-accent/20" style={{backgroundColor: theme === 'dark' ? '#0f172a' : undefined}}>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stats.totalWords.toLocaleString()}
              </div>
              <div className="text-accent text-sm">Words Written</div>
            </div>

            <div className="bg-background rounded-lg p-4 md:p-6 text-center border border-accent/20" style={{backgroundColor: theme === 'dark' ? '#0f172a' : undefined}}>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stats.averageWords}
              </div>
              <div className="text-accent text-sm">Average per Entry</div>
            </div>

            <div className="bg-background rounded-lg p-4 md:p-6 text-center border border-accent/20 col-span-2">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stats.totalPracticesCompleted}
              </div>
              <div className="text-accent text-sm">Total Practices Completed</div>
            </div>
          </div>

          {/* Inspirational Message */}
          <div className="bg-primary/10 rounded-lg p-6 mb-8 border-l-4 border-primary">
            <p className="text-primary italic text-center leading-relaxed">
              "You've journeyed through 84 days of intentional practice. 
              Every day completed, every word written, and every practice attempted 
              has contributed to your growth. Share your journey and inspire others to begin their own."
            </p>
          </div>

          {/* Share Actions */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-primary mb-4 text-center">Share Your Achievement</h3>
            
            <button
              onClick={handleDownloadStats}
              className="w-full bg-accent text-white px-6 py-3 rounded-lg hover:bg-primary transition-colors font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Download Stats Card
            </button>

            <button
              onClick={handleShareNative}
              className="w-full bg-background text-primary px-6 py-3 rounded-lg hover:bg-surface transition-colors font-medium border-2 border-accent flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {navigator.share ? 'Share' : 'Copy Share Text'}
            </button>

            {isCopied && (
              <div className="text-center text-sm text-primary bg-primary/10 py-2 rounded-lg">
                ✓ Copied to clipboard!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;

