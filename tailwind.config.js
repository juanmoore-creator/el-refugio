/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'muted-olive': '#8fbc8f',
        'snow': '#fcf7f8',
        'olive-bark': '#6b5b3e',
        'hunter-green': '#4a6c45',
        'blue-slate': '#5d737e',
      },
      fontFamily: {
        'sans': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

