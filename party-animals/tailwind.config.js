module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        culture: ['IBM Plex Mono', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
