/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A8A', // Deep Royal Blue
          light: '#2563EB',
          dark: '#1E40AF',
        },
        secondary: {
          DEFAULT: '#D4AF37', // Academic Gold
          light: '#FBBF24',
          dark: '#B45309',
        },
        accent: {
          DEFAULT: '#00E5FF', // Bright Cyan
          light: '#67E8F9',
          dark: '#0891B2',
        },
        dark: {
          DEFAULT: '#1F2937', // Dark Charcoal
          light: '#374151',
          lighter: '#4B5563',
        },
        light: {
          DEFAULT: '#FFFFFF', // Pure White
          off: '#F9FAFB', // Off White for slight contrast
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))',
      },
    },
  },
  plugins: [],
}
