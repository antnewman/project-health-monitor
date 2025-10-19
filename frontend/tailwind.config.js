/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        // TortoiseAI Brand Colors
        'tortoise-fuchsia': '#C724B1',
        'accent-green': '#00D9A3',
        'deep-slate': '#1A1A2E',
      },
    },
  },
  plugins: [],
}
