/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff5f5',
          100: '#fed7d7',
          500: '#E53E3E',
          600: '#C53030',
          700: '#9B2C2C',
        },
        accent: '#F6AD55',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
