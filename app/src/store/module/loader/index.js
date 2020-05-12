/**
 * Vuex module for a global loader component
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
      for (const loaderRequestID of Object.keys(state.loaderRequests))
        Vue.delete(state.loaderRequests, loaderRequestID);
    },
    clearAll2(state) {
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
     * this.$store.dispatch("loader/new", loaderRequest);
     */
    new({ commit, state }, loaderRequest = {}) {
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
     * this.$store.dispatch("loader/clear");
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
