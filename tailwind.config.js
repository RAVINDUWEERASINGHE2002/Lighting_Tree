/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9f4',
          100: '#dbf2e4',
          200: '#b9e5cc',
          300: '#89d1ad',
          400: '#53b688',
          500: '#2d9967',
          600: '#1b7d52',
          700: '#166443',
          800: '#145037',
          900: '#0f402d',
          950: '#062419',
        },
        gold: {
          50: '#fdfbf2',
          100: '#f9f4de',
          200: '#f3e6b7',
          300: '#ecd38a',
          400: '#e4bc5e',
          500: '#d4af37',
          600: '#b89028',
          700: '#946f22',
          800: '#795822',
          900: '#664a21',
          950: '#3c280f',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
