/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        "vina" :['Vina Sans','sans-serif'],
        "roboto" : ['Roboto','sans-serif']
      },
      colors:{
        transparent: 'transparent',
        dark_bg : '#0a0908',
        dark_fg : '#EDF5FC',
        dark_warning : '#EF626C',
        dark_success : '#7FC6A4',
        dark_other : '#414288'
      }
    },
  },
  plugins: [],
}

