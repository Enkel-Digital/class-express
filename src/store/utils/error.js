/**
 * Simple wrapper over actions from the error module to show errorDialogs.
 * If using dispatch directly to request for error in modules, we need to use root:true, this abstracts that away.
 * All functions are async since the actions are async and this can be used to give users a reference of the expected value
 * All functions return action's return value as this module is only supposed to handle wrapping and API abstraction
 */

import store from "@/store";

export default {
  /**
   * Pushes new error to the error handling module's "new" action
   * @function new
   * @param {object} error Error object, can be an instance of Error or can be a custom error object using createError function
   * @returns {String} Promise that resolves to an errorID Which can be used to clear the error later
   */
  async new(error) {
    return store.dispatch("error/new", error, { root: true });
  },
  /**
   * Deletes error with errorID from the error handling module's state
   * @function clear
   * @param {String} errorID of the error to clear
   */
  async clear(errorID) {
    return store.dispatch("error/clear", errorID, { root: true });
  },
  /**
   * Delete all errors from error module's state
   * @function clearAll
   */
  async clearAll() {
    return store.dispatch("error/clearAll", { root: true });
  },
};
