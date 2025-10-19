/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D946EF',
        secondary: '#334155',
        background: '#F8FAFC',
        accent: '#10B981',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        // TortoiseAI Brand Colors (kept for compatibility)
        'tortoise-fuchsia': '#D946EF',
        'accent-green': '#10B981',
        'deep-slate': '#334155',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      transitionDuration: {
        'tortoise': '300ms',
      },
      transitionTimingFunction: {
        'tortoise': 'ease-in-out',
      },
    },
  },
  plugins: [],
}
