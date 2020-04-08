/**
 * Webpack configuration file for compiling relayer server into a single output file
 * @author JJ
 *
 * This config file is built with references to:
 * @link https://medium.com/code-oil/webpack-javascript-bundling-for-both-front-end-and-back-end-b95f1b429810
 * @link https://www.codementor.io/@lawwantsin/compiling-our-express-server-with-webpack-lds4xof0y
 */

const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: "production",
  target: "node",
  entry: "./index.js",
  module: {
    rules: [{ test: /\.md$/, loader: "ignore-loader" }]
  },
  output: {
    path: path.resolve(__dirname, "./build"),
    // This needs to be index.js so that "npm run serve" or "npm run start" in docker behaves the same
    filename: "index.js"
  },
  externals: [nodeExternals()]
};
