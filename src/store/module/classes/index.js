/**
 * Vuex module for all things classes related
 */

import initialState from "./initialState";
import setter from "../../utils/setter";
import createGMapsImg from "./gMapsImage";

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
    /**
     * Generate an array of upcoming classes Object(s) from an array of IDs of upcoming classes
     * @todo Sort the classes by time of class.
     */
    upcomingClasses(state) {
      const upcomingClasses = {};

      for (const classID in state.upcomingClassesID)
        upcomingClasses[classID] = state.classes[classID];

      return Object.values(upcomingClasses).map(clas => {
        clas.locationImage = createGMapsImg(clas.location.coordinates);
        return clas;
      });
    }
  },
  actions: {
    /**
     * Initialization function for this module
     * @function init
     */
    async init({ commit, dispatch }) {
      /**
       * @todo Remove this once the class addition is built.
       * @todo Edit "vuex-persistedstate" plugin to ignore class objects as they should be fetched everytime.
       */
      commit("setter", ["classes", mock.classes]);

      await dispatch("getUpcomingClasses");
      await dispatch("getFavouriteClasses");
    },
    /**
     * Get list of upcomingClassesID from API
     * @function getUpcomingClassesID
     */
    async getUpcomingClasses({ commit }) {
      // @todo Replace with API call
      const upcomingClassesID = mock.upcomingClassesID;

      commit("setter", ["upcomingClassesID", upcomingClassesID]);
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
