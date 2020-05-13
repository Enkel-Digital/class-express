/**
 * Vuex module for a global loader component
 *
 * @todo make sure state is not persisted across app launches, if not at least, run clearAll on launch or something
 * @todo Implement timeout on loaders, removing after a fixed time
 * @todo All loader callers need to clear themselves, else should specify a timestamp of when to timeout
 * @todo If they specify a timestamp to delete remove the loader, they do not have the loader removal theselves.
 * @todo Built a auto clean up algorithm to figure out when to delete the loaders
 */

import Vue from "vue";
import initialState from "./initialState";
import randomAlphaNumeric from "./randomAlphaNumeric";

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    new(state, { loaderRequest, loaderRequestID }) {
      Vue.set(state.loaderRequests, loaderRequestID, loaderRequest);
    },
    clear(state, loaderRequestID) {
      Vue.delete(state.loaderRequests, loaderRequestID);
    },
    clearAll(state) {
      // Reset state by clearing it directly
      Vue.delete(state, "loaderRequests");
      Vue.set(state, "loaderRequests", {});
    }
  },
  getters: {
    /**
     * Getters used in the loader component's computed property.
     * These return only true or false
     */
    showFullLoader(state) {
      for (const loaderRequest of Object.values(state.loaderRequests))
        if (loaderRequest.fullScreen) return true;

      return false;
    },
    showTopLoader(state) {
      for (const loaderRequest of Object.values(state.loaderRequests))
        if (!loaderRequest.fullScreen) return true;

      return false;
    }
  },
  actions: {
    /**
     * Initialization function for this module
     * Clear all loaderRequests in state
     * @function init
     */
    init({ commit }) {
      commit("clearAll");
    },
    /**
     * @example
     * // Submit a new loader request to get back a request ID
     * // You always need to await for vuex actions, so await to get back the loader request ID
     * const await loaderID = this.$store.dispatch("loader/new", loaderRequest, { root: true });
     */
    async new({ commit, state }, loaderRequest = {}) {
      // IIFE to ensure loaderRequestID can be a const in this current context
      const loaderRequestID = (function() {
        // Keep generating rand ID till no more collisions
        let _loaderRequestID;
        do {
          _loaderRequestID = randomAlphaNumeric();
        } while (state.loaderRequests[_loaderRequestID]);

        return _loaderRequestID;
      })();

      commit("new", { loaderRequest, loaderRequestID });

      // Return the requestID so that the component can use it to remove its own loader request
      return loaderRequestID;
    },
    /**
     * @example
     * // Clear the specified loader request
     * this.$store.dispatch("loader/clear", loaderID, { root: true });
     */
    clear({ commit }, loaderRequestID) {
      commit("clear", loaderRequestID);
    },
    /**
     * @example
     * // Clear all loader requests
     * this.$store.dispatch("loader/clearAll");
     */
    clearAll({ commit }) {
      commit("clearAll");
    }
  }
};
