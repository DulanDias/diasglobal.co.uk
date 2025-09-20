import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        'accent-dark': 'var(--color-accent-dark)',
        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        'text-dark': 'var(--color-text-dark)',
        bg: 'var(--color-bg)',
        'bg-light': 'var(--color-bg-light)',
        card: 'var(--color-bg-card)',
        border: 'var(--color-border)',
        'border-light': 'var(--color-border-light)',
        navbar: 'var(--color-bg-light)',
        'navbar-mobile': 'var(--color-bg-light)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      spacing: {
        'xs': '0.5rem',
        'sm': '1rem',
        'md': '1.5rem',
        'lg': '2rem',
        'xl': '3rem',
        '2xl': '4rem',
        '3xl': '6rem',
        '4xl': '8rem',
      },
      borderRadius: {
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
      },
      boxShadow: {
        'sm': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'md': '0 8px 32px rgba(0, 0, 0, 0.2)',
        'lg': '0 16px 64px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 32px rgba(239, 74, 58, 0.3)',
      },
      transitionDuration: {
        'fast': '0.2s',
        'normal': '0.3s',
        'slow': '0.5s',
      },
      maxWidth: {
        'container': '1200px',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease forwards',
        'fade-in': 'fadeIn 1s ease forwards',
        'slide-in-left': 'slideInLeft 0.8s ease forwards',
        'slide-in-right': 'slideInRight 0.8s ease forwards',
        'scale-in': 'scaleIn 0.8s ease forwards',
        'scroll-bounce': 'scrollBounce 2s ease-in-out infinite',
        'pulse': 'pulse 2s ease-in-out infinite',
        'loading': 'loading 2s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeIn: {
          to: {
            opacity: '1',
          },
        },
        slideInLeft: {
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideInRight: {
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        scaleIn: {
          to: {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        scrollBounce: {
          '0%, 20%, 50%, 80%, 100%': {
            transform: 'translateY(0)',
          },
          '40%': {
            transform: 'translateY(-10px)',
          },
          '60%': {
            transform: 'translateY(-5px)',
          },
        },
        pulse: {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
          '50%': {
            transform: 'scale(1.05)',
            opacity: '0.8',
          },
        },
        loading: {
          '0%': { width: '0%' },
          '50%': { width: '70%' },
          '100%': { width: '100%' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

export default config
