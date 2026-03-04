import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#4F46E5',
      },
    },
  },
  plugins: [],
};

export default config;
