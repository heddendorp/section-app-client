const { addTailwindPlugin } = require("@ngneat/tailwind");
const tailwindConfig = require("./tailwind.config.js");

module.exports = (webpackConfig) => {
  addTailwindPlugin({
    webpackConfig,
    tailwindConfig,
    patchComponentsStyles: true,
  });
  return webpackConfig;
};
