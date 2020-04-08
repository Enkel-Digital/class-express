"use strict"; // Enforce use of strict verion of JavaScript

/**
 * @function 404 Handler for all not resource not founds
 * @notice Normal request middleware, called when no other route's are matched
 * @notice Wrapped in try/catch in case response fails.
 *
 * @Todo Log error either to error logs or to a logging service
 */
module.exports = function(req, res, next) {
  try {
    /// @Todo Log error either to error logs or to a logging service

    // Set status to indicate resource not found and send back the string representation of the HTTP code, i.e. "Not-Found"
    // res.sendStatus(404);

    // Send without the string representation. End the cycle right after setting with 404
    res.status(404).end();
  } catch (err) {
    // 500 error middleware is called upon catching any errors
    next(err);
  }
};
