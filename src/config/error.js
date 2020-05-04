/**
 * Error identifiers imported by other modules to use for consistency.
 */

// CONSTANT error identifiers
const error = {
  level: {
    FATAL: "FATAL",
    WARNING: "WARNING",
    RETRY: "RETRY"
  }
};

// Using module.exports instead of es6 module syntax for easier export syntax + import destructuring.
module.exports = error;
