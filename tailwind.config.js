/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'pure-white': '#FFFFFF',
        'off-white': '#F9FAFB',
        'dark-slate': '#0F172A',
        'emerald-green': '#059669',
      },
      fontFamily: {
        sans: ['Inter', 'var(--font-geist-sans)', 'sans-serif'],
      },
      letterSpacing: {
        'widest-plus': '0.2em',
      },
      borderWidth: {
        '1': '1px',
      },
    },
  },
  plugins: [],
}
