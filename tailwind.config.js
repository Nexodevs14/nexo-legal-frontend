/** @type {import('tailwindcss').Config} */
import { heroui } from "@heroui/react";

export default {
  content: [
    "./src/**/*.{js,ts,tsx,jsx,css}", 
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js',
    'node_modules/preline/dist/*.js',
  ],
  theme: {
    extend: {
      colors: {
        secondary: '#18a6a0',
        primary: '#142b44',
        green: '#18a6a0',
        success: '#18a6a0',
        warning: '#f2b84b',
        red: '#d1302b',
        danger: '#d1302b',
        ivory: '#f7f8fa',
        graphite: '#29333d'
      },
    },
  },
  darkMode: "class",
  plugins: [heroui(), 'flowbite/plugin', 'preline/plugin'],
}
