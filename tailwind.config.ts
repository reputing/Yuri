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
        bg:      '#0d0d17',
        bg2:     '#13131f',
        bg3:     '#1c1c2e',
        bg4:     '#252538',
        card:    '#16162a',
        accent:  '#e91e8c',
        accent2: '#b5179e',
        purple:  '#9b5de5',
        muted:   '#9898b0',
        faint:   '#5a5a78',
        border:  '#2a2a42',
        border2: '#3a3a58',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
