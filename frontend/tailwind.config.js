/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Elms Sans"', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#E7F7F5',
          100: '#FF6E6D',
          200: '#FFD100',
          300: '#DD9CB4',
          400: '#8962AB',
          500: '#171D3C',
          600: '#171D3C',
          700: '#171D3C',
          800: '#171D3C',
          900: '#171D3C',
          950: '#171D3C',
        },
        'pastel-purple': {
          'start': 'rgba(124, 89, 178, 0.1)',
          'end': 'rgba(124, 89, 178, 0.05)',
        },
        'dark-purple-border': '#7c59b2',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
