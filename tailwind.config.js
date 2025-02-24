/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'sage': {
          100: '#A3B18A',
        },
        'warm-gray': {
          100: '#B7B7A4',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        }
      }
    },
  },
  plugins: [],
};