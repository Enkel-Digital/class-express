/**
 * Config options module to be imported by the other modules to use for consistency.
 * @references https://paulund.co.uk/create-config-files-for-vuejs
 *
 * @todo Update to call an API to get all the config values instead of hardcoding them.
 * Hardcoded values should only be the default overrideable values
 */

// Where NODE_ENV is auto injected by vue CLI depending on whether npm run serve or npm run build is used.
// Seperate out reading the env var to prevent loading issue when used directly in "require"
const NODE_ENV = process.env.NODE_ENV.toLowerCase();

// Get config object for the current mode and merge it into the default config object
const config = Object.assign(
  {
    version: "0.0.1",
  },
  // Decide on config file to load based on build time env var
  // @todo To optimize this
  require(`./${NODE_ENV}`)
);

// @todo Remove before production
console.log("App config: ", config);

// Using module.exports instead of es6 module syntax for easier export syntax + import destructuring.
module.exports = config;
