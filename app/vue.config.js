const webpack = require("webpack");

/**
 * Get git values to be use in the vue app
 */
const childProcess = require("child_process");
const getGitValues = {
  commitHash: childProcess.execSync("git rev-parse HEAD").toString(),
  gitBranch: childProcess
    .execSync("git rev-parse --abbrev-ref HEAD")
    .toString(),
};

module.exports = {
  transpileDependencies: ["vuetify"],
  // Used when using local npm packages (components/plugins) for testing before they are published.
  chainWebpack: (config) => config.resolve.symlinks(false),
  configureWebpack: {
    module: {
      noParse: /\.md$/,
      rules: [
        {
          test: /\.md$/,
          loader: "ignore-loader",
        },
      ],
    },
    plugins: [
      // Create a plugin to inject in environment variables
      // https://webpack.js.org/plugins/environment-plugin/
      // Inject in the git values and other misc values
      new webpack.EnvironmentPlugin({
        ...getGitValues,
        buildTime: Date(),
      }),
    ],
  },
};
