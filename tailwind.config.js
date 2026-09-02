/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // for Vite
    "./src/**/*.{js,jsx,ts,tsx}", // for React components
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#1e3bf0',
          600: '#1830d6',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#ff7a18',
        },
        brandbg: '#ffffff',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['"Playfair Display"', 'Georgia', 'ui-serif', 'system-ui'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
        'glass-hover': '0 12px 40px 0 rgba(31, 38, 135, 0.15)',
        'organic': '0 20px 50px -12px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
};
