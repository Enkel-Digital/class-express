module.exports = {
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    module: {
      noParse: /\.md$/,
      rules: [
        {
          test: /\.md$/,
          loader: "ignore-loader"
        }
      ]
    }
  }
};
