/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        app: {
          bg: {
            primary: 'var(--color-bg-primary)',
            secondary: 'var(--color-bg-secondary)',
          },
          surface: {
            DEFAULT: 'var(--color-surface)',
            hover: 'var(--color-surface-hover)',
          },
          border: 'var(--color-border)',
          text: {
            primary: 'var(--color-text-primary)',
            secondary: 'var(--color-text-secondary)',
            muted: 'var(--color-text-muted)',
          },
          accent: {
            DEFAULT: 'var(--color-accent)',
            hover: 'var(--color-accent-hover)',
            soft: 'var(--color-accent-soft)',
          },
        },
        sidebar: {
          bg: 'var(--sidebar-bg)',
          border: 'var(--sidebar-border)',
        },
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
