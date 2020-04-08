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
 * @dev To send the error message back to the client, and not just the status code with an empty body.
 * @dev Use the "send_msg_back" property. Set it to true to send mesage back to client.
 * @dev err.send_msg_back = true; // Set true to return the error message back to the client
 *
 * @note Should the error message be sent back to the user?
 */
module.exports = function(err, req, res, next) {
  // Log error either to error logs or to a logging service
  logger.error(err);

  // Make sure that the status code is an error code
  if (res.statusCode < 400) res.status(err.code || 500);

  // End the request after making sure status code is set
  res.end(err.send_msg_back ? err.message : undefined);
};
