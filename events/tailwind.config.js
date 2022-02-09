module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      aspectRatio: {
        '2/1': '2 / 1',
      },
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
