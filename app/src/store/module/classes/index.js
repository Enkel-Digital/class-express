/**
 * Vuex module for all things classes related
 */

import Vue from "vue";
import initialState from "./initialState";
import setter from "../../utils/setter";
import createGMapsImg from "./gMapsImage";

// @todo Remove mock data
import mock from "../../mockData";

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    setter,
    toggleFavourite(state, classID) {
      /** @notice Toggle the state using Vue methods for triggering reactive listeners */
      if (state.favouriteClassesID[classID])
        Vue.delete(state.favouriteClassesID, classID);
      else Vue.set(state.favouriteClassesID, classID, true);

      /** @notice Alternate solution to using Vue.set and Vue.delete is to do a shallow copy for reactive triggers */
      // if (state.favouriteClassesID[classID])
      //   delete state.favouriteClassesID[classID];
      // else state.favouriteClassesID[classID] = true;
      // // For reactivity
      // state.favouriteClassesID = { ...state.favouriteClassesID };
    }
  },
  getters: {
    /**
     * @todo Sort by time the class was added as a favourite.
     */
    favouriteClasses(state) {
      const favouriteClasses = [];

      for (const classID of Object.keys(state.favouriteClassesID))
        favouriteClasses.push(state.classes[classID]);

      return favouriteClasses;
    },
    /**
     * Generate an array of upcoming classes Object(s) from an array of IDs of upcoming classes
     * @todo Sort the classes by time of class.
     */
    upcomingClasses(state) {
      const upcomingClasses = {};

      for (const classID of Object.keys(state.upcomingClassesID))
        upcomingClasses[classID] = state.classes[classID];

      return Object.values(upcomingClasses).map(clas => {
        clas.locationImage = createGMapsImg(clas.location.coordinates);

        /** @notice Explicit data setting needed to prevent data caching */
        if (state.favouriteClassesID[clas.id]) clas.favourite = true;
        else clas.favourite = false;

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

      await dispatch("getUpcomingClassesID");
      await dispatch("getFavouriteClassesID");
    },
    /**
     * Get list of upcomingClassesID from API
     * @function getUpcomingClassesID
     */
    async getUpcomingClassesID({ commit }) {
      // @todo Replace with API call
      const upcomingClassesID = mock.upcomingClassesID;

      commit("setter", ["upcomingClassesID", upcomingClassesID]);
    },
    /**
     * Get list of favouriteClasses from API
     * @function getFavouriteClasses
     */
    async getFavouriteClassesID({ commit }) {
      // @todo Replace with API call
      const favouriteClassesID = mock.favouriteClassesID;

      commit("setter", ["favouriteClassesID", favouriteClassesID]);
    },
    async toggleFavourite({ commit }, classID) {
      // Optimistic UI, show toggle first
      commit("toggleFavourite", classID);

      // Call backend and handle error if any to change back favourite value

      // If error from updating server, then call mutation again to toggleBack
      // commit("toggleFavourite", classID);
    }
  }
};
