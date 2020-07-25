/**
 * Config for development
 * Config options module to be imported by the other modules to use for consistency.
 */

// Using this instead of es6 module syntax for easier export syntax + import destructuring.
module.exports = {
  // URL cannot have ending slash "/"
  apiUrl: "http://localhost:3001",
  errorApiEndpoint: "http://localhost:3003/new",
};
