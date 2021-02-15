const colors = require("tailwindcss/colors");
module.exports = {
  prefix: "",
  purge: {
    content: ["./src/**/*.{html,ts}"],
    enabled: process.title.includes("prod"),
  },
  darkMode: false, // or 'media' or 'class'
  // Disable plugins that provide functionality already provided by @angular/flex-layout
  corePlugins: {
    flex: false,
    flexDirection: false,
    flexGrow: false,
    flexShrink: false,
    flexWrap: false,
    gridAutoColumns: false,
    gridAutoFlow: false,
    gridAutoRows: false,
    gridColumn: false,
    gridColumnEnd: false,
    gridColumnStart: false,
    gridRow: false,
    gridRowEnd: false,
    gridRowStart: false,
    gridTemplateColumns: false,
    gridTemplateRows: false,
  },
  theme: {
    extend: {
      colors: {
        primary: colors.teal,
        accent: colors.fuchsia,
        warn: colors.red,
      },
      spacing: {
        100: "25rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/line-clamp"),
  ],
};
