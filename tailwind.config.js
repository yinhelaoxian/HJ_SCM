/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: '#0B0F17',
        card: '#131926',
        'card-hover': '#1A2235',
        border: '#1E2D45',
        accent: '#2D7DD2',
        danger: '#E53935',
        warning: '#F57C00',
        success: '#00897B',
        primary: '#E8EDF4',
        secondary: '#7A8BA8',
        muted: '#445568',
        'blue-light': '#3D9BE9'
      },
      fontFamily: {
        display: ['Barlow Condensed', 'sans-serif'],
        sans: ['IBM Plex Sans', 'sans-serif']
      }
    }
  },
  plugins: []
}
