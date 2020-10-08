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

  // Some useful articles for reference on Vue+PWA
  // https://medium.com/@myeris/getting-started-with-pwas-an-ios-nightmare-f0712c2f950
  // https://itnext.io/pwa-splash-screen-and-icon-generator-a74ebb8a130
  pwa: {
    // Because of this stupid decision to support >iOS 11.3 devices, the set the default to no....
    // Setting it to yet, prevents it from adding a second meta tag that prevents things like IOS splash screen from working
    // https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    // https://github.com/vuejs/vue-cli/issues/2889#issuecomment-551714457
    // https://github.com/vuejs/vue-cli/issues/3269#issuecomment-551713836
    appleMobileWebAppCapable: "yes",

    // https://medium.com/appscope/changing-the-ios-status-bar-of-your-progressive-web-app-9fc8fbe8e6ab
    // Not setting status bar style to black-translucent for now, as on our white background, you cant see the white characters
    // appleMobileWebAppStatusBarStyle: "black-translucent",
  },
};
