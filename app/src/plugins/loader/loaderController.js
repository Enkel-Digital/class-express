import Vue from "vue";

/**
 * @todo
 * Implement timeout on loaders, removing after a fixed time
 * All loader callers need to clear themselves, else should specify a timestamp of when to timeout
 * If they specify a timestamp to delete remove the loader, they do not have the loader removal theselves.
 * Built a auto clean up algorithm to figure out when to delete the loaders
 */

/**
 * Example/Reference on how loaderRequest object would look like
 */
// const loaderRequestReference = {
//   fullScreen: true // Bool value to determine what type of loader to show
// };

const state = Vue.observable({
  loaderRequests: {},
  showFullLoader: false,
  showTopLoader: false,
});

export default {
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
