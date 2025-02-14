/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'custom':'623px' //custom breakpoints for 375px width
      },
      colors: {
        brown: {
          50: '#fdf8f6',
          100: '#f7e9e4',
          200: '#e8cbbd',
          300: '#d9ac96',
          400: '#c0836a',
          500: '#a65c3f',
          600: '#854930',
          700: '#653620',
          800: '#442410',
          900: '#221208',
        },
      },
    },
  },
  plugins: [],
}

