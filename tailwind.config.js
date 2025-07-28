/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light theme colors (current design)
        light: {
          bg: '#f8fafc',
          surface: '#ffffff',
          primary: '#334155',
          accent: '#64748b',
          muted: '#94a3b8',
          border: '#e2e8f0',
        },
        // Dark theme colors
        dark: {
          bg: '#0f172a',
          surface: '#1e293b',
          primary: '#f1f5f9',
          accent: '#cbd5e1',
          muted: '#64748b',
          border: '#334155',
        },
        // Monastic theme colors
        monastic: {
          bg: '#f0ebe0',
          surface: '#e8dfd0',
          primary: '#2a1f15',
          accent: '#5d4e3a',
          muted: '#7a6b52',
          border: '#c4b594',
        },
      },
    },
  },
  plugins: [],
} 