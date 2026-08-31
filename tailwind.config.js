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
        cyber: {
          950: '#060911',
          900: '#0a0e1a',
          850: '#0f1526',
          800: '#141c33',
          700: '#1e294b',
          600: '#2b3a66',
          cyan: '#06b6d4',
          blue: '#3b82f6',
          purple: '#8b5cf6',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace']
      },
      boxShadow: {
        'cyan-glow': '0 0 20px -5px rgba(6, 182, 212, 0.25)',
        'blue-glow': '0 0 20px -5px rgba(59, 130, 246, 0.25)',
        'rose-glow': '0 0 20px -5px rgba(244, 63, 94, 0.25)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.5)'
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite'
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        }
      }
    },
  },
  plugins: [],
}
