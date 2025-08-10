# 12 Weeks of Asceticism

A minimalist web app to guide users through a 12-week asceticism program. Track your progress, unlock weekly practices, and reflect on your journey.

## Tech Stack
- React 19 (Vite)
- TailwindCSS 4
- React Router 7
- Supabase (Authentication & Database)
- Context API + localStorage

## Features
- Landing page with welcome and CTA
- User authentication and account management
- Dashboard with progress tracker and week navigation
- 12 weekly practice pages with journal entries and reflection prompts
- Timeline view of all journal entries
- Progress overview with weekly layer information
- Dark/light theme toggle
- GDPR compliant privacy policy
- Responsive design for mobile and desktop

## Getting Started

1. Clone the repo:
   ```sh
   git clone https://github.com/martinwinther/12-weeks-of-asceticism.git
   cd 12-weeks-of-asceticism
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the dev server:
   ```sh
   npm run dev
   ```

5. Open your browser at the local address shown in the terminal.

## Project Structure

```
src/
├── components/          # Reusable UI components
├── context/            # React context providers
├── data/               # Weekly content and prompts
│   ├── layersByWeek.ts # Weekly layer definitions
│   ├── promptsByWeek.ts # Reflection prompts
│   └── weeklyTeachings.js # Weekly teachings content
├── lib/                # External service configurations
├── pages/              # Main application pages
├── utils/              # Utility functions
└── App.jsx             # Main application component
```

## Customization
- Edit weekly content in `src/data/layersByWeek.ts` and `src/data/promptsByWeek.ts`
- Modify weekly teachings in `src/data/weeklyTeachings.js`
- Update styling using TailwindCSS classes

## Deployment
The app is configured for deployment on Vercel with proper routing and environment variable support.

---

Built for personal growth and simplicity.
