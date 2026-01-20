/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'refugio-sage': '#8fbc8f',
        'refugio-cream': '#fcf7f8',
        'refugio-earth': '#6b5b3e',
        'refugio-forest': '#4a6c45',
        'refugio-slate': '#5d737e',
      },
      fontFamily: {
        'sans': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

