/**
 * Vuex module for all things classes related including reviews
 */

import Vue from "vue";
import moment from "moment";
import initialState from "./initialState";
import setter from "../../utils/setter";

// @todo Remove mock data
import mock from "../../mockData";

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    setter,
    clearUserReview(state) {
      // Clear reviews to prevent caching in memory
      Vue.delete(state.review, "userReviews");
    },
    class(state, { classObject, add, remove }) {
      if (add) Vue.set(state.classes, classObject.id, classObject);
      else if (remove) Vue.delete(state.classes, classObject.id);
      else throw new Error("Invalid action used on updateClassesToFetch");
    },
  },
  getters: {
    /**
     * @todo Update this to show cancelled past classes
     */
    pastClasses(state) {
      return;
    },
  },
  actions: {
    /**
     * Initialization function for this module
     * @function init
     */
    async init({ commit, dispatch }) {
      /**
       * @todo Replace with API call
       */
      commit("setter", ["classes", mock.classes]);
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
  },
};
