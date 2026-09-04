/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        railway: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#005a9c',
          600: '#004c85',
          700: '#003e6e',
          800: '#003057',
          900: '#002544',
        },
      },
    },
  },
  plugins: [],
};
