/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './pages/**/*.html',
    './js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#009efffa',
        'primary-dark': '#3300ff',
        'primary-light': '#ccc'
      },
    },
  },
  plugins: [],
} 