/**
 * Module exports utility function to format and add additional
 * info before error is reported to the Error Tracking Service.
 * @author JJ
 */

import cloneDeep from "lodash.clonedeep";

/**
 * Used to format error object and add in more info that is not needed locally before sending to Error Tracking Service
 * @function formatErrorForPost
 * @param {object} originalError Original error object either created using createError or a custom literal
 * @returns {object} The formatted error object to send
 */
export default function formatErrorForPost(originalError, router) {
  // Clone error to modify the error before sending to the Error Tracking Service
  const error = cloneDeep(originalError);
  // const error = originalError;

  // Get current route info when error is recieved to help with replicating issue if router is given
  if (router)
    error.routeInfo = {
      fullPath: router.currentRoute.fullPath,
      name: router.currentRoute.name,
      params: router.currentRoute.params,
      query: router.currentRoute.query,
    };

  // Delete actions if any before pushing to error tracking service
  if (error.more) if (error.more.actions) delete error.more.actions;

  return error;
}
