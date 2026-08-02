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
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'cursive'],
      },
    },
  },
  plugins: [],
};
