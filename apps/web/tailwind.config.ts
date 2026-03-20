import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--fs-background)',
        surface: 'var(--fs-surface)',
        card: 'var(--fs-card)',
        border: 'var(--fs-border)',
        brand: 'var(--fs-primary)',
        success: 'var(--fs-success)',
        danger: 'var(--fs-danger)',
        warning: 'var(--fs-warning)',
        text: {
          primary: 'var(--fs-text-primary)',
          secondary: 'var(--fs-text-secondary)',
        },
      },
      boxShadow: {
        glass: '0 10px 30px rgba(0, 0, 0, 0.35)',
      },
      backdropBlur: {
        glass: '12px',
      },
    },
  },
  plugins: [],
};

export default config;
