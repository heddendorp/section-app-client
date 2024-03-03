const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          default: '#4f46e5',
          on: '#ffffff',
          container: '#f3f4f6',
          onContainer: '#111827',
        },
        secondary: {
          default: '#585e71',
          on: '#ffffff',
          container: '#ffffff',
          onContainer: '#111827',
          defaultDark: '#c1c6dd',
          onDark: '#2b3042',
          containerDark: '#414659',
          onContainerDark: '#dde1f9',
        },
        tertiary: {
          default: '#745471',
          on: '#ffffff',
          container: '#ffd7f8',
          onContainer: '#2b122b',
          defaultDark: '#e2bbdc',
          onDark: '#422740',
          containerDark: '#5a3d57',
          onContainerDark: '#ffd7f8',
        },
        error: {
          default: '#ba1b1b',
          on: '#ffffff',
          container: '#ffdad4',
          onContainer: '#410001',
        },
        background: {
          default: '#fefbff',
          on: '#1b1b1f',
        },
        surface: {
          default: '#fefbff',
          on: '#1b1b1f',
        },
        variant: {
          default: '#e1e1ec',
          on: '#44464e',
        },
        outline: { default: '#75767f', dark: '#8f909a' },
        gray: colors.stone,
      },
      fontFamily: {
        display: ['General Sans', 'sans-serif'],
      },
      fontWeight: {
        hairline: 100,
        thin: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
      },
    },
    fontFamily: {
      sans: ['General Sans', 'sans-serif'],
      mono: [
        'SFMono-Regular',
        'Consolas',
        'Liberation Mono',
        'Menlo',
        'Courier',
        'monospace',
      ],
    },
    fontWeight: {
      hairline: 100,
      thin: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
  ],
};
