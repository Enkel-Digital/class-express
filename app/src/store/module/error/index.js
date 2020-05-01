/**
 * Vuex module for error handling
 */

import Vue from "vue";
import initialState from "./initialState";
// import setter from "../../utils/setter";
// import router from "@/router";

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    // setter,
    newError(state, { errorIndex, error }) {
      // If none specified, append it
      if (!errorIndex) errorIndex = state.errors.length;

      // Might wanna use splice since I dont wanna replace the element, but rather add to it
      Vue.set(state.errors, errorIndex, error);
    },
    // Use mutation to clear an error once it is resolved.
    deleteError(state, { errorIndex = 0 }) {
      // Will these 2 have the same effect?

      Vue.delete(state.errors, errorIndex);
      // Delete the first element
      state.errors.splice(0, 1);
    }
  },
  actions: {
    /**
     * Initialization function for this module
     * @function init
     */
    async init({ commit, dispatch }) {
      /**
       * Clear all errors
       * @todo Remove this once the class addition is built.
       * @todo Edit "vuex-persistedstate" plugin to ignore class objects as they should be fetched everytime.
       */
    },
    async newError({ commit, dispatch }, error) {
      // Push this into a global error queue like the original snack bar idea that I had
      //
    },
    /**
     * Add a classID to "Queue" to get the details fetched
     * @function getClass
     *
     * @example this.$store.dispatch("points/getClass", classID); // When using from a component
     * @example dispatch("getClass", classID); // When using in actions from this module
     *
     * @todo remove setter call in init action
     * @todo everytime I need a class, trigger this action to push classID in and fetch the class from API
     */
    async updateServer({ state, commit }, classID) {
      // Instead of a vuex action, make this into a standalone function. Since vuex action are methods that are publicly accessible
      // Whereas this will only be used internally.
    }
  }
};
