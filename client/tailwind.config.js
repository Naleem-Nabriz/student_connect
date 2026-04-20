/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f4f9',
          100: '#d1e8f3',
          200: '#a8d3e7',
          300: '#7ebedb',
          400: '#4f9fc6',
          500: '#0077B6',
          600: '#00689f',
          700: '#005781',
          800: '#044868',
          900: '#083c55',
        },
        secondary: {
          50: '#fff4f1',
          100: '#fde7e0',
          200: '#f8cabc',
          300: '#f2ac97',
          400: '#ea8f73',
          500: '#E07A5F',
          600: '#c96a52',
          700: '#aa5642',
          800: '#8a4737',
          900: '#6f3a2d',
        },
        accent: {
          50: '#fff9e8',
          100: '#fff3cc',
          200: '#fde89b',
          300: '#f8da6f',
          400: '#f5cf58',
          500: '#F2C94C',
          600: '#ddb73f',
          700: '#b9952f',
          800: '#947624',
          900: '#755d1d',
        },
        surface: {
          50: '#fffdf8',
          100: '#FDF6EC',
          200: '#f4eadb',
          300: '#eadfce',
        },
        warm: {
          500: '#3D3D3D',
          400: '#62574d',
          300: '#85786c',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}
