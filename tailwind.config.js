/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'base-dark': '#0A0A0A',
        'card-dark': '#121212',
        'panel-dark': '#181818',
        'border-dark': '#2A2A2A',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A0A0A0',
        'neon-green': '#00FF66',
        'neon-blue': '#00AAFF',
        'neon-purple': '#AA00FF',
        'neon-red': '#FF0055',
        'online': '#00FF66',
        'offline': '#FF0055',
        'warning': '#FFAA00',
      },
      boxShadow: {
        'neon-green': '0 0 5px #00FF66, 0 0 10px #00FF66',
        'neon-blue': '0 0 5px #00AAFF, 0 0 10px #00AAFF',
        'neon-purple': '0 0 5px #AA00FF, 0 0 10px #AA00FF',
        'neon-red': '0 0 5px #FF0055, 0 0 10px #FF0055',
      },
      animation: {
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
};