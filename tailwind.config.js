/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  darkMode: "class",
  
  theme: {
    extend: {
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        'spin-reverse': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-out',
        'spin-reverse': 'spin-reverse 1s linear infinite',
      }
    }
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}

