import type { Config } from 'tailwindcss'

const { fontFamily } = require('tailwindcss/defaultTheme')

const config: Config = {
  darkMode: 'class',
  lightMode: ['dark', 'gray', 'bright',],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },

      colors: {
        primary: '#038C7F',
        secondary: '#F2C641',
        tertiary: {
          dark: '#F27405',
          light: '#F2C641',
        },
      },

      fontFamily: {
        poppins: ['var(--font-poppins)', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
}
export default config
