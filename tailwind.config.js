/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
   theme: {
  extend: {
    keyframes: {
      wave: {
        '0%, 100%': { transform: 'translateY(0) scale(1)' },
        '25%': { transform: 'translateY(-3px) scale(1.05)' },
        '50%': { transform: 'translateY(0) scale(1)' },
        '75%': { transform: 'translateY(3px) scale(0.95)' },
      },
    },
    animation: {
      wave: 'wave 2s ease-in-out infinite',
    },
  },
},

  plugins: [],
}

