/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'],
      },
      colors: {
        bg: 'hsl(0 0% 4%)',
        surface: 'hsl(0 0% 8%)',
        'surface-alt': 'hsl(0 0% 11%)',
        text: 'hsl(0 0% 96%)',
        muted: 'hsl(0 0% 53%)',
        stroke: 'hsl(0 0% 12%)',
      },
      backgroundImage: {
        'ai-gradient': 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
        'ai-gradient-r': 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
      },
    },
  },
  plugins: [],
}
