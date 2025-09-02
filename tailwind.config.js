/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'glass': {
          50: 'var(--glass-weak-bg)',
          100: 'var(--glass-bg)',
          200: 'var(--glass-strong-bg)',
          300: 'var(--glass-border)',
          400: 'var(--glass-strong-border)',
          500: 'var(--glass-strong-border)',
        },
        'text': {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
        },
        'accent': {
          DEFAULT: 'var(--accent-color)',
          success: 'var(--success-color)',
          warning: 'var(--warning-color)',
          error: 'var(--error-color)',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
