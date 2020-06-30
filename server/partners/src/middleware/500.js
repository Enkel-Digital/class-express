"use strict"; // Enforce use of strict verion of JavaScript

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("middleware:500");

/**
 * @function 500 internal server error route handler
 * @dev For error status code other than 500, look at example below
 * @dev     res.status(401); // Set statusCode directly with the built in method
 * @dev     OR
 * @dev     err.code = 401; // Set the code as property of the object
 * @dev Note that an Error status code set with res.status() method will have precedence over err.code
 * @dev next(err); // Call the next middleware function with the err object once the code is set.
 *
 * ----------------------------------------------------------------------------------------------
 *
 * @notice
 * MOST HANDLERS / ROUTES should do their own error handling and response.
 * Because they may have specific needs and want to respond differently.
 * The 500 error catch, should ONLY be used for unexpected errore or as a default generic error handler.
 * Error will be logged here too since if it reached this middleware, it means the error was not previously handled
 * By not relying on this, we also reduce the need for next function to be passed in to route handlers
 */
module.exports = function (err, req, res, next) {
  // Log error either to error logs or to a logging service
  logger.error(err);

  // Make sure that the status code is an error code
  if (res.statusCode < 400) res.status(err.code || 500);

  // End the request after making sure status code is set
  res
    .status(err.code ? err.code : 500)
    .json({ success: false, error: err.message });
};
