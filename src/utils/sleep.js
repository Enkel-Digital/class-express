"use strict"; // Enforce use of strict version of JavaScript

/**
 * Sleep module used for simulating delays, build on setTimeout
 * @module Sleep
 * @author JJ
 */

/**
 * Curried Sleep function, allowing you to partially apply a bool to treat timeout value as milliseconds or minutes
 * @function Sleep
 * @param {boolean} mins
 * @param {number} timeout
 */
const sleep = (mins) => async (timeout) =>
  new Promise((resolve) =>
    setTimeout(resolve, mins ? timeout * 60 * 1000 : timeout)
  );

/**
 * @notice Export 2 variants of the function and the function itself
 * @notice The 2 function variants uses partial application to pass in bool, determining if function should treat timeout as milliseconds or minutes
 * @notice Lastly the function itself is also exported as the module's default export object
 */
module.exports = sleep;
module.exports.milli = sleep(false);
module.exports.minutes = sleep(true);
