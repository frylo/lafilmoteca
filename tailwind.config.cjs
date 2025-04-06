const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/**/*.css',
  ],
  theme: {
    extend: {
      colors: {
        filmoteca: {
          dark: '#0D1E1A',
          gray: '#50645D',
          olive: '#788F6D',
          white: '#FDFDFC',
          light: '#D4DCDD',
        },
        // opcional: mezcla tus colores con los de tailwind
        ...colors,
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  safelist: [
    'text-filmoteca-white',
    'text-filmoteca-dark',
    'text-filmoteca-gray',
    'text-filmoteca-olive',
    'text-filmoteca-light',
    'bg-filmoteca-white',
    'bg-filmoteca-dark',
    'bg-filmoteca-gray',
    'bg-filmoteca-olive',
    'bg-filmoteca-light',
    'border-filmoteca-white',
    'border-filmoteca-dark',
    'border-filmoteca-gray',
    'border-filmoteca-olive',
    'border-filmoteca-light',
    'text-[#FDFDFC]',
    'text-[#0D1E1A]',
    'text-[#50645D]',
    'text-[#788F6D]',
    'text-[#D4DCDD]',
  ],
  plugins: [],
}