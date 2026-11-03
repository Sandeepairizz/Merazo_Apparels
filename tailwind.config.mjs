/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        white:     '#FFFFFF',
        'off-white': '#F6F5F2',
        ink:       '#0A0A0A',
        accent:    '#E10600',
        muted:     '#6B6B6B',
      },
      fontFamily: {
        display: ['Unbounded', 'Arial Black', 'sans-serif'],
        body:    ['Inter', 'Helvetica Neue', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        'h1': 'clamp(3rem, 11vw, 12rem)',
        'h2': 'clamp(2rem, 6vw, 6rem)',
        'h3': 'clamp(1.25rem, 3vw, 2.5rem)',
        'micro': '0.6875rem',
      },
      lineHeight: {
        display: '0.9',
        tight:   '1.1',
      },
      letterSpacing: {
        display: '-0.04em',
        micro:   '0.08em',
      },
      maxWidth: {
        grid: '1600px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out':   'cubic-bezier(0.76, 0, 0.24, 1)',
      },
    },
  },
  plugins: [],
};

