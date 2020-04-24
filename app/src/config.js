/**
 * Config options module to be imported by the other modules to use for consistency.
 */

// Using this instead of es6 module syntax for easier export syntax + import destructuring.
module.exports = {
  // URL cannot have ending slash "/"
  // apiUrl: "https://api.classexpress.com",
  apiUrl: "http://localhost:3000",
  version: "0.0.1"
};
