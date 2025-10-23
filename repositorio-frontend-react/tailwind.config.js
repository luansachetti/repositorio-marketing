/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vermelho: "#E53935",
        laranja: "#FF9800",
        amarelo: "#FFEB3B",
      },
    },
  },
  plugins: [],
};
