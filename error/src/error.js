/**
 * Error identifiers and modifiers imported by other modules to use for consistency in creating error objects.
 * Note that these are not Error class instances, but custom error objects used for controlling UI feedback and error reporting.
 * @author JJ
 *
 * @example
 * // Import from the module and destructure for simpler access. Make sure namespace is free.
 * import { ERROR, createError } from "@/utils/error"
 *
 * @example
 * // Create default API error
 * createError(ERROR.level.FATAL, ERROR.type.API)
 *
 * @example
 * // Custom error
 * createError("WARNING", ERROR.custom("Algolia service down", "Search service is down", { code: algoliaReturnCode || 500 }))
 *
 * @example
 * // Extending a default API error using the extends parameter
 * createError("RETRY", ERROR.type.API, { httpCode: 400 })
 *
 * @example
 * // Extending a default API error using the extends method
 * createError("RETRY", ERROR.extends(ERROR.type.API, { httpCode: 400 }))
 *
 * @example
 * // Extending a default error for re-use without a fixed ERR_level
 * const apiOverloadedError = ERROR.extends(ERROR.type.API, { httpCode: 429 })
 */

import cloneDeep from "lodash.clonedeep";

/**
 * Function to extend a pre-defined error type
 * @param {(string|object)} errorType
 * @param {*} moreInfo
 * @returns {object} Error object with the extended properties
 *
 * @example
 * // Extending API error type with http status code with constant ERROR identifiers
 * ERROR.extends(ERROR.type.API, { httpCode: 400 })
 *
 * @example
 * // Extending API error type with http status code with string as string
 * ERROR.extends(ERROR.type.API, { httpCode: 400 })
 *
 * @notice "extends" is a JavaScript keyword thus naming with a underscore
 * @notice Extended properties are in the "more" field
 */
function _extends(errorType, moreInfo) {
  // If errorType string is passed in, get the errorType object
  if (typeof errorType !== "object") errorType = ERROR.type[errorType];

  // Use destructuring syntax to create a new object
  return {
    ...errorType,
    more: moreInfo,
  };
}

/**
 * Creates custom error type objects when none of the predefined error types are suitable
 * @function custom
 * @param {String} name Name of the error. Will be displayed via the UI
 * @param {String} description Description of the error. Will be displayed via the UI
 * @param {*=} moreInfo Anything you would like to provide to extend the error object
 * @returns {Object} custom error object
 *
 * For example if an external service like algolia is down.
 * @example custom("Algolia external service down", "Algolia search service is down", { code: algoliaReturnCode || 500 })
 *
 * This should be used sparingly as it makes it harder to track down many different custom errors.
 * Below shows format of the expected returned custom error object with example values
 * const ERR_CUSTOM = {
 *   type: "CUSTOM",
 *   name: "CUSTOM Error",
 *   description: "Something bad happen that was not previously expected"
 * }
 */
function custom(name, description, moreInfo) {
  const customError = {
    type: "CUSTOM",
    name: name || "CUSTOM error",
    description: description || "",
  };

  // If more info is specified to extend the error
  if (moreInfo) customError.more = moreInfo;

  return customError;
}

/**
 * Function for creating error objects
 * @function createError
 * @param {string} ERR_level Level of the error, can specify a string or use a constant
 * @param {object} ERR_type Error object type
 * @param {*=} moreInfo Anything you would like to provide to extend the error object
 * @returns {Object} Error object
 *
 * @example
 * // Create default API error
 * createError(ERROR.level.FATAL, ERROR.type.API)
 *
 * @example
 * // Custom error
 * createError("WARNING", ERROR.custom("Algolia service down", "Search service is down", { code: algoliaReturnCode || 500 }))
 *
 * @example
 * // Extending a default API error using the extends parameter
 * createError("RETRY", ERROR.type.API, { httpCode: 400 })
 *
 * @example
 * // Extending a default API error using the extends method
 * createError("RETRY", ERROR.extends(ERROR.type.API, { httpCode: 400 }))
 */
function createError(ERR_level, ERR_type, moreInfo) {
  // Use deepClone to prevent editing constant ERROR identifiers
  const error = cloneDeep(ERR_type);

  error.level = ERR_level.toUpperCase();

  // If more info is specified to extend the error
  if (moreInfo) error.more = moreInfo;

  return error;
}

/**
 * CONSTANT ERROR identifiers and modifier methods.
 * Error is hard coded and frozen to prevent modification
 *
 * Error level definitions:
 * - FATAL: Fatal error, stop app process, but allow some background tasks to continue.
 * - WARNING: Show user failure warning and indicate some processes may fail but allow user to continue.
 * - RETRY: Show user failure and retry in background OR ask if user would like to retry.
 * - INFO: Show user failure and retry in background OR ask if user would like to retry. Difference with RETRY is that, this is fine to ignore without any consequences.
 */
const ERROR = Object.freeze({
  // Error level with descending level of importance
  level: {
    FATAL: "FATAL",
    WARNING: "WARNING",
    RETRY: "RETRY",
    INFO: "INFO",
  },
  type: {
    NETWORK: {
      type: "NETWORK",
      name: "Network connection issue",
      description:
        "There is an issue with the network right now! Try checking connection status or restarting app if needed.",
    },
    API: {
      type: "API",
      name: "API call failed",
      description: "API failed with http code >= 400",
    },
    INTERNAL: {
      type: "INTERNAL",
      name: "Internal error detected",
      description: "Internal logic failed somewhere... YIKES 😭",
    },
    AUTH: {
      type: "AUTH",
      name: "Authentication failed",
      description: "Unable to authenticate or bad credentials used",
    },
    // @todo Perhaps allow some stack trace for undefined errors to better debug
    UNKNOWN: {
      type: "UNKNOWN",
      name: "UNKNOWN",
      description: "Unknown error occurred 😫",
    },
  },
  custom,
  extends: _extends,
});

export { ERROR, createError };
