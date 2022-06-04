module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          default: '#00658d',
          on: '#ffffff',
          container: '#c6e7ff',
          onContainer: '#001e2d',
          defaultDark: '#82cfff',
          onDark: '#00344b',
          containerDark: '#004c6b',
          onContainerDark: '#c6e7ff',
        },
        secondary: {
          default: '#b8006c',
          on: '#ffffff',
          container: '#ffd9e4',
          onContainer: '#3e0021',
          defaultDark: '#ffb0cc',
          onDark: '#640038',
          containerDark: '#8d0051',
          onContainerDark: '#ffd9e4',
        },
        tertiary: {
          default: '#346b00',
          on: '#ffffff',
          container: '#acf771',
          onContainer: '#0b2000',
          defaultDark: '#91da59',
          onDark: '#183800',
          containerDark: '#265100',
          onContainerDark: '#acf771',
        },
        error: {
          default: '#ba1a1a',
          on: '#ffffff',
          container: '#ffdad6',
          onContainer: '#410002',
          defaultDark: '#ffb4ab',
          onDark: '#690005',
          containerDark: '#93000a',
          onContainerDark: '#ffdad6',
        },
        background: {
          default: '#fcfcff',
          on: '#191c1e',
          defaultDark: '#191c1e',
          onDark: '#e2e2e5',
        },
        surface: {
          default: '#fcfcff',
          on: '#191c1e',
          defaultDark: '#191c1e',
          onDark: '#e2e2e5',
        },
        variant: {
          default: '#dde3ea',
          on: '#41484d',
          defaultDark: '#41484d',
          onDark: '#c1c7ce',
        },
        outline: { default: '#71787e', dark: '#8b9198' },
      },
      fontFamily: {
        display: ['Josefin Sans', 'sans-serif'],
      },
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
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
