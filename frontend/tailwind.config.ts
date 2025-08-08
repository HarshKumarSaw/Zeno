import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/page.tsx',
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './styles/**/*.{css,scss}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [],
};

export default config;
