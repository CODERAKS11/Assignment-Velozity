/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        priority: {
          critical: '#ef4444',
          high: '#f97316',
          medium: '#eab308',
          low: '#22c55e',
        },
        status: {
          todo: '#6b7280',
          inprogress: '#3b82f6',
          inreview: '#a855f7',
          done: '#22c55e',
        }
      }
    },
  },
  plugins: [],
}
