//apps/frontend/tailwind.config.ts
import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'


const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.{css,scss}', // ✅ Correct
  ],
  theme: {
    extend: {},
  },
  plugins: [forms],
}

export default config

