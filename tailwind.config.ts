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
          50: '#f3f0ff',
          100: '#e9e3ff',
          200: '#d4c7ff',
          300: '#b39fff',
          400: '#8f6eff',
          500: '#6244c7', // Color primario base
          600: '#5335b8',
          700: '#462da4',
          800: '#3a2585',
          900: '#2f1f6b',
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

