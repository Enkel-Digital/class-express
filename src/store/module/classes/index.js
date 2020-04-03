/**
 * Vuex module for all things classes related
 */

import initialState from "./initialState";
import setter from "../../utils/setter";

// @todo Remove mock data
import mock from "../../mockData";

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    setter
  },
  getters: {
    favouriteClasses(state) {
      // Use an array of favouriteClassesID to get the data from server
      // return state.subscriptionPlans
    },
    upcomingClasses(state) {
      // Use an array of upcomingClassesID to get the data from server
      // return state.subscriptionPlans.find(plan => plan.id === state.nextPlanID);
    }
  },
  actions: {
    /**
     * Initializing function for this module
     * @function init
     */
    async init({ dispatch }) {
      dispatch("getFavouriteClasses");
    },
    /**
     * Get list of favouriteClasses from API
     * @function getFavouriteClasses
     */
    async getFavouriteClasses({ commit }) {
      // @todo Replace with API call
      const favouriteClasses = mock.favouriteClasses;

      commit("setter", ["favouriteClasses", favouriteClasses]);
    },
    async toggleFavourite(classID) {
      console.log("toggle fav class: ", classID);
      // Optimistic UI, show toggle first

      // Toggle the state of the favourite class in state.
      if (this.favouriteClasses[classID]) delete this.favouriteClasses[classID];
      else this.favouriteClasses[classID] = true;

      // Call backend and handle error if any to change back favourite value
    }
  }
};
