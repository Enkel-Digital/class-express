/**
 * Config options module to be imported by the other modules to use for consistency.
 * @references https://paulund.co.uk/create-config-files-for-vuejs
 */

// Seperate out reading the env var to prevent loading issue when used directly in "require"
const NODE_ENV = process.env.NODE_ENV.toLowerCase();

// Get config object for the current mode and merge it into the default config object
const config = Object.assign(
  {
    version: "0.0.1",
  },
  // Load config on the fly
  // @todo To optimize this
  require(`./${NODE_ENV}`)
);

// @todo Remove before production
console.log("App config: ", config);

// Using module.exports instead of es6 module syntax for easier export syntax + import destructuring.
module.exports = config;
