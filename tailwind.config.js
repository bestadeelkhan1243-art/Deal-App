/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: '#ED1C24',
        accent: {
          blue: '#3B82F6',
          yellow: '#EAB308',
        }
      }
    },
  },
  presets: [require("nativewind/preset")],
  plugins: [],
}

