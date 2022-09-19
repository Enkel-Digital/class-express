/**
 * loaderController factory function
 * @function loaderControllerFF
 * @param {*} Vue Vue class/module received from the install method of the plugin
 * @returns loaderController
 */
export default function loaderControllerFF(Vue) {
  const state = Vue.observable({ loaderRequests: {} });

  return {
    /**
     * Getters used in the loader component's computed property.
     * These return only true or false
     */
    showLoader() {
      return Object.keys(state.loaderRequests).length;
    },
    showFullLoader() {
      for (const loaderRequest of Object.values(state.loaderRequests))
        if (loaderRequest.fullScreen) return true;

      return false;
    },
    showTopLoader() {
      for (const loaderRequest of Object.values(state.loaderRequests))
        if (!loaderRequest.fullScreen) return true;

      return false;
    },

    /**
     * Initialization function for this module
     * Clear all loaderRequests in state
     * Alias for clearAll method
     * @function init
     */
    init() {
      this.clearAll();
    },
    new(loaderRequest = {}) {
      // Keep generating rand ID till no more collisions
      let loaderRequestID;

      do {
        loaderRequestID = Math.random().toString(36).substring(2);
      } while (state.loaderRequests[loaderRequestID]);

      Vue.set(state.loaderRequests, loaderRequestID, loaderRequest);

      // Return the requestID so that the component can use it to remove its own loader request
      return loaderRequestID;
    },
    clear(loaderRequestID) {
      Vue.delete(state.loaderRequests, loaderRequestID);
    },
    clearAll() {
      Vue.set(state, "loaderRequests", {});
    },
  };
}
