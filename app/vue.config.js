module.exports = {
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    module: {
      noParse: /\.md$/
    }
  }
};
