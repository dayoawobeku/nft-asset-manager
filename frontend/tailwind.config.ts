import type {Config} from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        white: '#FFFFFF',
        neutral: {
          25: '#F4F4F4',
          50: '#E9E9E9',
          100: '#D3D2D2',
          200: '#B6B4B5',
          300: '#918F8F',
          400: '#6C6A6A',
          500: '#484445',
          600: '#231F20',
          700: '#1D1A1B',
          800: '#121010',
          900: '#070606',
        },
        purple: {
          25: '#E6DBFE',
          50: '#D5C2FE',
          100: '#C0A4FD',
          200: '#AB86FC',
          300: '#9667FC',
          400: '#8149FB',
          500: '#6C3DD1',
          600: '#5631A7',
          700: '#41257E',
          800: '#2B1854',
          900: '#1A0F32',
        },
      },
      spacing: {
        '4.5': '1.125rem', // 18px
        '7.5': '1.875rem', // 30px
        18: '4.5rem', // 72px
        22: '5.5rem', // 88px
        35: '8.75rem', // 140px
      },
      borderRadius: {
        '10px': '10px',
        '2.5xl': '1.25rem', // 20px
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
