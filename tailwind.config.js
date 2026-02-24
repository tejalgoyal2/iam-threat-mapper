/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          black: '#0a0a0a',
          dark: '#0d1117',
          panel: '#111820',
          border: '#1a2332',
          green: '#00ff41',
          'green-dim': '#00cc33',
          'green-muted': '#0a4a1e',
          amber: '#ffb000',
          red: '#ff3333',
          cyan: '#00d4ff',
          gray: '#4a5568',
          'gray-light': '#8b9bb4',
          white: '#c9d1d9',
        }
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', '"Fira Code"', 'Consolas', 'monospace'],
        display: ['"Share Tech Mono"', 'monospace'],
      },
      animation: {
        'cursor-blink': 'blink 1s step-end infinite',
        'scan-line': 'scanline 8s linear infinite',
        'glow-pulse': 'glowpulse 2s ease-in-out infinite alternate',
        'type-in': 'typein 0.5s steps(20) forwards',
        'fade-up': 'fadeup 0.6s ease-out forwards',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        glowpulse: {
          '0%': { textShadow: '0 0 4px #00ff41, 0 0 8px #00ff4140' },
          '100%': { textShadow: '0 0 8px #00ff41, 0 0 20px #00ff4160, 0 0 40px #00ff4130' },
        },
        fadeup: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(0,255,65,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '24px 24px',
      },
    },
  },
  plugins: [],
}
