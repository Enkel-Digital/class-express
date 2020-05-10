/**
 * Vuex module for error handling
 */

import Vue from "vue";
import initialState from "./initialState";
import api from "@/store/utils/fetch";

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    newError(state, error) {
      // https://vuejs.org/v2/guide/reactivity.html#For-Arrays
      // Append new error to the end of errors array
      Vue.set(state.errors, state.errors.length, error);
    },
    deleteError(state, { errorIndex = 0 } = {}) {
      Vue.delete(state.errors, errorIndex);
    }
  },
  actions: {
    /**
     * Initialization function for this module
     * Clear all errors
     * @function init
     */
    async init({ commit, dispatch }) {
      // This will not work if the error is triggered before the vuex mod's init is ran
      // How to run clear state on startup / page load/reload ?
      commit("error", false);
    },
    /**
     * @example this.$store.dispatch("error/new", error); // Where error is either an instance of Error or custom error object
     * by default push all errors to server? Other than a few errors like network errors and stuff.
     * If there is a network error, how can I even push the error to the server?
     * Have a internal error tracker then?
     */
    async new({ commit }, error) {
      // @example Error object
      const exampleErrorObj = {
        name: "Network connection failed",
        description: "Failed to connect to API.",
        // Should the error be displayed on the errorDialog?
        // Defaults to true
        display: true,
        // Can this error be dismissed via the errorDialog?
        // Defaults to true
        dismissable: true,
        // Timestamp when the error was received in the error handling module
        time: Date.now()
      };

      try {
        // @todo Remove for production
        console.error("error mod:", error instanceof Error, error);

        // If error class instance, use the message alone
        if (error instanceof Error) error = { error: error.message };

        // Push this into a global error queue like the original snack bar idea that I had

        // Add timestamp to error object
        error.time = Date.now();

        // After error object is created, push it into errors list
        commit("newError", error);

        // Try reporting error to API if possible
        const resp = await api.post("/error", error);

        // @todo Remove for production?
        if (resp.success) console.log(resp);
        else throw new Error("ERROR Reporting failed");
      } catch (error) {
        console.error("errored out in vuex action error/new");
        // @todo Then show the error dialog with a non dismissable error
      }
    },
    /**
     * @example this.$store.dispatch("error/clear"); // Clear the current latest error
     */
    async clear({ commit }) {
      // commit("error", false);
      // After error object is created, push it into errors list
      commit("deleteError");
    }
  }
};
