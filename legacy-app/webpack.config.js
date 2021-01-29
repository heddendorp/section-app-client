const { patchPostCSS } = require("@ngneat/tailwind");
const tailwindConfig = require("./tailwind.config.js");

module.exports = (config) => {
  patchPostCSS(config, tailwindConfig, true);
  return config;
};
