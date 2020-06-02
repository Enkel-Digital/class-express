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
  },
};
