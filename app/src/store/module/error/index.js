/**
 * Vuex module for error handling
 */

import Vue from "vue";
import initialState from "./initialState";
import { ERROR, createError } from "@/constants/error"; // used to create undefined error type if did not get an error with a TYPE attribute
import randomAlphaNumeric from "../../utils/randomAlphaNumeric";
import postToErrorService from "./postToErrorService";
import formatErrorForPost from "./formatErrorForPost";

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    new(state, error) {
      Vue.set(state.errors, error.errorID, error);
    },
    clear(state, errorID) {
      Vue.delete(state.errors, errorID);
    },
    clearAll(state) {
      // Reset state by clearing it directly
      Vue.delete(state, "errors");
      Vue.set(state, "errors", {});
    },
  },
  getters: {
    /**
     * Getter to get the earliest error to be displayed
     * Does not order the errors depending on dismissability
     */
    displayEarliestError(state) {
      // Start with any random first element of Object.values array to start off the comparison
      let earliestError = Object.values(state.errors)[0];

      for (const errorID in state.errors) {
        const error = state.errors[errorID];
        if (!error.display) continue;
        else if (error.time < earliestError.time) earliestError = error;
      }

      return earliestError;
    },
    /**
     * @todo Perhaps we should use a object, then return the earliest triggered array via a getter rather then an array
     */
  },
  actions: {
    /**
     * Initialization function for this module
     * Clear all errors
     * @function init
     */
    async init({ dispatch }) {
      dispatch("clearAll");
    },
    /**
     * @example
     * // Where error is either an instance of Error or custom error object
     * this.$store.dispatch("error/new", error);
     */
    async new({ commit, state }, error) {
      try {
        // @todo Remove
        console.error("error mod:", error instanceof Error, error);

        // If error class instance, use the message alone
        if (error instanceof Error) {
          error = createError(ERROR.level.FATAL, ERROR.type.UNKNOWN, {
            instanceofError: true,
            errorMessage: error.message,
          });
        }

        /* Populate error object with default values and other custom properties */
        // Keep generating rand errorID till no more collisions
        do {
          error.errorID = randomAlphaNumeric();
        } while (state.errors[error.errorID]);
        // Display the error if not specified
        if (error.display === undefined) error.display = true;
        // If error is to be displayed and dismissable is not set, make it display by default
        if (error.dismissable === undefined && error.display)
          error.dismissable = true;

        // Add timestamp to error object
        error.time = Date.now();

        // After error object is created, push it into errors list
        commit("new", error);

        // Try reporting error to API if possible using the custom API caller instead. Refer to function's for doc on why.
        const response = await postToErrorService(formatErrorForPost(error));

        if (response.success) {
          if (process.env.NODE_ENV !== "production") console.log(response);
        } else throw new Error("ERROR Reporting failed");

        return error.errorID;
      } catch (error) {
        console.error("errored out in vuex action error/new", error);

        // @todo Then show the error dialog with a non dismissable error
        // Show "Attempt to report Previous error to developers failed. Try contacting us directly instead? Screenshot this screen and email us instead"
      }
    },
    /**
     * @example
     * // Clear the current latest error
     * this.$store.dispatch("error/clear");
     */
    async clear({ commit }, errorID) {
      commit("clear", errorID);
    },
    /**
     * @example
     * // Clear the current latest error
     * this.$store.dispatch("error/clearAll");
     */
    async clearAll({ commit }) {
      commit("clearAll");
    },
  },
};
