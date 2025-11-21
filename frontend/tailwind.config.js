/***** tailwind config *****/
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'white': '#ffffff',
        'black': '#000000',
        'primary': '#111827', // Matches gray-900 used in Footer
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        serif: ['Merriweather', 'serif'],
        sans: ['Lato', 'sans-serif'],
      },
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ]
};
