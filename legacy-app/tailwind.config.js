const { guessProductionMode } = require('@ngneat/tailwind');

process.env.TAILWIND_MODE = guessProductionMode() ? 'build' : 'watch';

module.exports = {
  prefix: '',
  mode: 'jit',
  content: [
    './apps/**/*.{html,ts,css,scss,sass,less,styl}',
    './libs/**/*.{html,ts,css,scss,sass,less,styl}',
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          default: '#0053db',
          on: '#ffffff',
          container: '#dae1ff',
          onContainer: '#00164d',
        },
        secondary: {
          default: '#585e71',
          on: '#ffffff',
          container: '#dde1f9',
          onContainer: '#161b2c',
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
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
  ],
};
