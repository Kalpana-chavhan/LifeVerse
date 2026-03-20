/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel:   ['"Press Start 2P"', 'monospace'],
        display: ['"Orbitron"', 'sans-serif'],
        body:    ['"Rajdhani"', 'sans-serif'],
      },
      colors: {
        neon: {
          purple: '#b44fff',
          cyan:   '#00f5ff',
          green:  '#39ff14',
          pink:   '#ff0090',
          yellow: '#ffd700',
          orange: '#ff6b00',
        },
        dark: {
          900: '#050510',
          800: '#0a0a20',
          700: '#0f0f2e',
          600: '#1a1a40',
          500: '#252555',
        },
      },
      screens: {
        'xs': '420px',
      },
    },
  },
  plugins: [],
}
