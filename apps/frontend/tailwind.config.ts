//apps/frontend/tailwind.config.ts
import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'


const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.css', // ✅ Correct
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}

export default config

