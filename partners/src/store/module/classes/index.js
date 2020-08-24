/**
 * Vuex module for all things classes related including reviews
 */

import Vue from "vue";
import initialState from "./initialState";
import setter from "../../utils/setter";
import apiError from "@/store/utils/apiError";
import apiWithLoader from "@/store/utils/apiWithLoader";

import { getClass, addClass } from "./getClass";

// import { getClassSchedule, addClassSchedule } from "./getClassSchedule";
// import { getPartnerSchedule, addPartnerSchedule } from "./getPartnerSchedule";

import moment from "moment";
// import unixseconds from "unixseconds";

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    setter,
    clearUserReview(state) {
      // Clear reviews to prevent caching in memory
      Vue.delete(state.review, "userReviews");
    },
    addClass,
  },
  actions: {
    getClass,
    /**
     * Gets all the class of this partner
     */
    async getAllClasses({ rootState, dispatch }) {
      const response = await apiWithLoader.get(
        `/class/of/${rootState.user.partnerID}`
      );

      if (!response.success)
        return apiError(response, () => dispatch("getAllClasses"));

      console.log("response", response);

      dispatch("getClass", response.classIDs);
    },
    /**
     * Get Schedules of a given class and date
     * @function getClassSchedule
     * @param {number} [dateCursor=today] unix timestamp of the start of the day in utc
     */
    async getClassSchedule(
      { rootState, commit },
      { classID, dateCursor = "" }
    ) {
      // @todo
    },
    async cancelClass({ rootState, commit }, classID) {
      // @todo
    },
    // @todo Update to get only the basic review data instead of using the whole reviews object
    // API should return result without userReview
    async getReview({ state, commit, dispatch }, classID) {
      // If review is already in state, ignore request
      if (state.review && classID === state.review[classID]) return;

      const response = await apiWithLoader.get(`/reviews/class/${classID}`);
      if (!response.success)
        return apiError(response, () => dispatch("getReview"));

      commit("setter", ["review", response.reviews]);
    },
    async getUserReview({ state, commit, dispatch }, classID) {
      // If review is already in state, ignore request
      if (state.review && classID === state.review[classID]) return;

      const response = await apiWithLoader.get(`/reviews/class/${classID}`);
      if (!response.success)
        return apiError(response, () => dispatch("getReview"));

      commit("setter", ["review", response.reviews]);
    },
    /**
     * @returns classID of newly created class if class creation succeeded, else returns false and trigger error dialog
     */
    async newClass({ commit }, clas) {
      // @todo Replace with call to create class API
      // const classID = /* api call here */

      // @todo Remove this mock classID returned to the component to redirect to ClassDetails view
      return 2;
    },
  },
};
