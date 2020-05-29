/**
 * Simple wrapper over actions from the loader module.
 * If using dispatch directly to request for loader in modules, we need to use root:true, this abstracts that away.
 * All functions are async since the actions are async and this can be used to give users a reference of the expected value
 * All functions return action's return value as this module is only supposed to handle wrapping and API abstraction
 */

import store from "@/store";

export default {
  /**
   * Pushes new loaderRequest to loader module's "new" action
   * @function new
   * @param {object} loaderRequest Loader request object, refer to the module's action's documentation
   * @returns {String} Promise that resolves to a loaderRequestID Which can be used to clear the loader later
   */
  async new(loaderRequest) {
    return store.dispatch("loader/new", loaderRequest, { root: true });
  },
  /**
   * Deletes loaderRequest with loaderRequestID from loader module's state
   * @function clear
   * @param {String} loaderRequestID Loader request ID, refer to the module's action's documentation
   */
  async clear(loaderRequestID) {
    return store.dispatch("loader/clear", loaderRequestID, { root: true });
  },
  /**
   * Deletes all loaderRequests from loader module's state
   * @function clearAll
   */
  async clearAll() {
    return store.dispatch("loader/clearAll", { root: true });
  },
};
