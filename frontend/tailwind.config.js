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
      }
    },
  },
  plugins: [],
}

