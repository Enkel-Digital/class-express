/**
 * Vuex module for error handling
 */

import Vue from "vue";
import initialState from "./initialState";
import { ERROR, createError } from "@/constants/error";
import postToErrorService from "./postToErrorService";
import formatErrorForPost from "./formatErrorForPost";

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    new(state, error) {
      Vue.set(state.errors, state.errors.length, error);
    },
    /**
     * Clear error with errorID, if not available, fallback to errorIndex, if not available, fallback to error array element 0
     * @param {Number} [errorID] ID of the error, found by looping through the array to find the error
     * @param {Number} [errorIndex] Index of the error in the error array
     */
    clear(state, { errorID, errorIndex = 0 } = {}) {
      if (errorID) {
        for (let i = 0; i < state.errors.length; i++)
          if (errorID === state.errors[i].ID) {
            Vue.delete(state.errors, i);
          }
      } else Vue.delete(state.errors, errorIndex);
    },
    clearAll(state) {
      // Reset state by clearing it directly
      Vue.delete(state, "errors");
      Vue.set(state, "errors", []);
    },
  },
  getters: {
    /**
     * Getter to filter for errors to be showed to user
     * Does not order the errors depending on dismissability
     */
    displayableErrors(state) {
      return state.errors.filter((error) => error.display);
    },
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
    async new({ commit }, error) {
      try {
        // @todo Remove
        console.error("error mod:", error instanceof Error, error);

        // If error class instance, use the message alone
        if (error instanceof Error) {
          // @todo make a func to get default variables and variables from the error object out?
          // @todo Use createError here
          error = { error: error.message };
        }

        /* Populate error object with default values and other custom properties */
        // Display the error if not specified
        if (error.display === undefined) error.display = true;
        // If error is to be displayed and dismissable is not set, make it display by default
        if (error.display && error.dismissable === undefined)
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
