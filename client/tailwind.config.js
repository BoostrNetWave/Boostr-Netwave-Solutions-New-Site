/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ink': '#0D0D12',
        'ink-soft': '#1A1A2E',
        'blue': '#0052FF',
        'blue-light': '#3374FF',
        'blue-pale': '#EEF3FF',
        'gold': '#F5C842',
        'gold-pale': '#FFFBEB',
        'muted': '#6B7280',
        'soft': '#F9F9F7',
        'border': '#E5E7EB',
        'border-soft': '#F3F4F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    }
  },
  plugins: [],
}
