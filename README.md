# 12 Weeks of Asceticism

A comprehensive web application designed to guide users through a structured 84-day asceticism program. The app combines modern web technologies with thoughtful UX design to create an engaging personal development platform.

## What This App Does

This application serves as a digital companion for individuals undertaking a 12-week asceticism journey. It provides:

- **Structured Progress Tracking**: Users navigate through 84 days (12 weeks × 7 days) with each week introducing new ascetic practices
- **Daily Reflection System**: Integrated journaling with guided prompts for each day
- **Practice Management**: Track completion of weekly practices like phone-free mornings, cold showers, and digital fasting
- **Progress Visualization**: Interactive dashboard showing completion status, reflection indicators, and journey statistics
- **Personalized Experience**: Multiple themes (light, dark, monastic) and responsive design for all devices

## Technical Architecture

### Frontend Stack

- **React 19** with modern hooks and functional components
- **Vite** for fast development and optimized production builds
- **TailwindCSS 4** with custom theme system and responsive design
- **React Router 7** for client-side routing with protected routes
- **Context API** for state management across authentication, theme, and app data

### Backend & Data

- **Supabase** for authentication, real-time database, and user management
- **PostgreSQL** database with optimized schemas for user progress and journal entries
- **Row Level Security (RLS)** for secure data access
- **Real-time subscriptions** for live data updates

### Key Technical Features

#### Data Synchronization

- Automatic sync between local state and Supabase database
- Optimistic updates with error handling and rollback
- Efficient data loading with selective queries

#### Security Implementation

- Input sanitization using DOMPurify for XSS prevention
- Protected routes with authentication guards
- GDPR-compliant data handling and privacy controls

#### Performance Optimizations

- Lazy loading of components and routes
- Memoized calculations for progress tracking
- Efficient re-rendering with React.memo and useMemo
- Optimized bundle splitting with Vite

## Code Organization

### Component Architecture

```text
src/
├── components/          # Reusable UI components
│   ├── Button.jsx      # Consistent button styling
│   ├── CompletionModal.jsx # Achievement celebration
│   ├── LoadingSpinner.jsx  # Loading states
│   └── ThemeToggle.jsx     # Theme switching
├── context/            # State management
│   ├── AppContext.jsx  # Main app state and business logic
│   ├── AuthContext.jsx # Authentication state
│   └── ThemeContext.jsx # Theme management
├── pages/              # Route components
│   ├── Dashboard.jsx   # Main progress tracking
│   ├── DayPage.jsx     # Individual day interface
│   └── TimelinePage.jsx # Journal timeline view
└── utils/              # Helper functions
    ├── localStorage.js  # Local storage utilities
    └── sanitize.js     # Security utilities
```

### Data Flow

1. **Authentication**: Supabase Auth → AuthContext → Protected Routes
2. **Progress Tracking**: User actions → AppContext → Supabase sync
3. **Journal Entries**: Text input → Sanitization → Database storage
4. **Theme Management**: User preference → ThemeContext → CSS variables

## Development Practices

### Code Quality

- **ESLint** configuration with React-specific rules
- **TypeScript** interfaces for data structures
- **Consistent naming conventions** and component patterns
- **Error boundaries** and graceful error handling

### User Experience

- **Progressive disclosure** of features based on user progress
- **Accessibility considerations** with semantic HTML and ARIA labels
- **Mobile-first responsive design** with touch-friendly interactions
- **Loading states** and skeleton screens for better perceived performance

### Security & Privacy

- **Input validation** and sanitization for all user-generated content
- **Secure authentication** with Supabase Auth
- **Privacy-focused design** with minimal data collection
- **GDPR compliance** with cookie consent and data export capabilities

## Deployment & Infrastructure

- **Vercel** deployment with automatic CI/CD
- **Environment variable management** for secure configuration
- **CDN optimization** for global performance
- **Database backups** and monitoring through Supabase