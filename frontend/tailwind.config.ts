// /frontend/tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/page.tsx',                  // explicitly include root route file
    './app/**/*.{ts,tsx}',             // all app route files
    './components/**/*.{ts,tsx}',      // reusable UI components
    './styles/**/*.{css,scss}',        // global style files
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [],
};

export default config;
