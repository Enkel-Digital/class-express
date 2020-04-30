/**
 * Vuex module for all things classes related
 */

import Vue from "vue";
import router from "@/router";
import moment from "moment";
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
      /** @notice Toggle state using Vue methods to trigger reactive listeners */
      if (state.favouriteClassesID[classID])
        Vue.delete(state.favouriteClassesID, classID);
      else Vue.set(state.favouriteClassesID, classID, true);

      /** @notice Alternate solution to using Vue.set and Vue.delete is to do a shallow copy for reactive triggers */
      // if (state.favouriteClassesID[classID])
      //   delete state.favouriteClassesID[classID];
      // else state.favouriteClassesID[classID] = true;
      // // For reactivity
      // state.favouriteClassesID = { ...state.favouriteClassesID };
    },
    setUpcomingClass(state, { classID, action, timestamp }) {
      /** @notice Change state using Vue methods to trigger reactive listeners */
      // @todo Change set and delete to use the specific timestamp of that class
      if (action) Vue.set(state.upcomingClassesID, classID, true);
      else Vue.delete(state.upcomingClassesID, classID);
    },
    clearUserReview(state) {
      // Clear reviews to prevent caching in memory
      Vue.delete(state.review, "userReviews");
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
     * @todo Sort by time class was attended
     */
    pastClasses(state) {
      // If pastClassesID is not loaded before getter is ran, skip getter.
      if (!state.pastClassesID) return [];

      const pastClasses = {};

      for (const classID of Object.keys(state.pastClassesID))
        pastClasses[classID] = state.classes[classID];

      return Object.values(pastClasses).map(clas => {
        /** @notice Explicit data setting needed to prevent data caching */
        if (state.favouriteClassesID[clas.id]) clas.favourite = true;
        else clas.favourite = false;

        return clas;
      });
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
      commit("setter", ["partners", mock.partners]);

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
     * Get list of pastClassesID from API
     * @function getPastClassesID
     */
    async getPastClassesID({ dispatch, commit }) {
      // @todo Replace with API call
      const pastClassesID = mock.pastClassesID;

      commit("setter", ["pastClassesID", pastClassesID]);

      dispatch("getClass", Object.keys(pastClassesID));
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
    },
    async reserveClass({ state, rootState, commit }, classID) {
      const { points: classPoints } = state.classes[classID];
      const userPoints = rootState.points.points;

      // Check if user have enough points for the class
      if (userPoints.left < classPoints) {
        // redirect to topup view
        if (confirm("Not enough points, topup?"))
          router.push({ name: "topup" });
      } else if (confirm(`Reserve class for ${classPoints} points?`)) {
        // @todo Show loading UI while making call to API

        // @todo Add API call to set upcoming class
        // @notice API logic should deduct points too, but locally update it without checking API

        /** @notice Pessimistic UI, commit changes after API call is successful */
        commit("setUpcomingClass", { classID, action: true, timestamp: "" });

        // Deduct points
        commit("points/deductPoints", classPoints, { root: true });

        // @todo Handle API failures

        // @todo Remove loading UI after API call is done
      }
    },
    async cancelClass({ state, rootState, commit }, classID) {
      const { points: classPoints } = state.classes[classID];

      // @todo User obviously cannot cancel when the class is in progress or after it ended
      // @todo Add time check to ensure user knows that we will charge him extra if cancelling late

      if (confirm("Cancel your reservation?")) {
        // @todo Show loading UI while making call to API

        // @todo Add API call to cancel upcoming class
        // @notice API logic should add back points too, but locally update it without checking API

        /** @notice Pessimistic UI, commit changes after API call is successful */
        commit("setUpcomingClass", { classID, action: false, timestamp: "" });

        // Refund back the points
        commit("points/refundPoints", classPoints, { root: true });

        // @todo Handle API failures

        // @todo Remove loading UI after API call is done
      }
    },
    async getReview({ commit }, classID) {
      // If the review is already in state, ignore it

      // @todo Replace with API call
      // @notice Using shallow copy to prevent deleting value from mock data
      const review = { ...mock.reviews[classID] };

      // @todo To remove once API is done, as API will return result without userReview
      delete review.userReviews;

      commit("setter", ["review", review]);
    },
    async getUserReview({ commit }, classID) {
      // If the review is already in state, ignore it

      // @todo Replace with API call
      const review = mock.reviews[classID];

      commit("setter", ["review", review]);
    },
    async saveNewReview(
      { commit },
      { classID, ratings = 0, description = "" }
    ) {
      // @todo Add API call to send review to server
      console.log("hello in save", classID, ratings, description);
    }
  }
};
