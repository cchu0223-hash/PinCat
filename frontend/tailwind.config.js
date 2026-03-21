/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        warm: {
          paper: '#fdf6e3',
          cardLight: '#fffef9',
          cardDark: '#1c1710',
          bg: '#f5edd8',
          bgDark: '#141009',
          border: '#e8d5b0',
          borderDark: '#3d2e0e',
          ink: '#3d2e0e',
          inkLight: '#7a5c2e',
          inkDark: '#f5edd8',
        },
      },
      fontFamily: {
        hand: ['"Caveat"', 'cursive'],
        handBold: ['"Caveat Brush"', 'cursive'],
        sans: ['"Nunito"', 'sans-serif'],
      },
      boxShadow: {
        polaroid: '0 4px 6px -1px rgba(61,46,14,0.15), 0 10px 30px -5px rgba(61,46,14,0.1)',
        card: '2px 4px 12px rgba(61,46,14,0.12)',
        tag: '1px 2px 4px rgba(61,46,14,0.15)',
      },
    },
  },
  plugins: [],
}
