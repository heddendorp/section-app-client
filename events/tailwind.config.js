module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            hr: {
              marginTop: '1em',
              marginBottom: '1em',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
