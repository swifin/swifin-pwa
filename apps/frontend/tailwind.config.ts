//apps/frontend/tailwind.config.ts
import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'


const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('forms'),
  ],
}

export default config

