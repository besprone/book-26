import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#6244c7', // Color primario base
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        accent: {
          50: '#e0f9fa',
          100: '#b3f0f3',
          200: '#80e6ec',
          300: '#4ddce5',
          400: '#26d5df',
          500: '#11ced8', // Color acento/secundario base
          600: '#0fb9c2',
          700: '#0ca1a8',
          800: '#09898e',
          900: '#056164',
        },
      },
      fontFamily: {
        sans: ['Funnel Display', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config

