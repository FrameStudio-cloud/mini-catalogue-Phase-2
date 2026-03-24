export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a1a2e",        // deep navy (stays)
        accent: "#e94560",         // red (stays)
        gold: "#F5C518",           // bold yellow
        forest: "#2D6A4F",         // bold green
        earth: "#D4A017",          // warm gold
        cream: "#FFF8E7",          // warm background
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}