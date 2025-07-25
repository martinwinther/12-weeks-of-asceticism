module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc', // off-white
        primary: '#334155', // calm blue-gray
        accent: '#64748b', // muted accent
      },
      fontFamily: {
        serif: ['Merriweather', 'serif'],
        mono: ['Fira Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
