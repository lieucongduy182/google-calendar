import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/_components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'light-blue': 'var(--light-blue)',
        'dark-blue': 'var(--dark-blue)',
        'light-orange': 'var(--light-orange)',
        'dark-orange': 'var(--dark-orange)',
        'calendar-color': 'var(--calendar-color)',
      },
    },
  },
  plugins: [],
};

export default config;
