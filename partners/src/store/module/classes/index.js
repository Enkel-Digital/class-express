/**
 * Vuex module for all things classes related including reviews
 */

import Vue from "vue";
import initialState from "./initialState";
import setter from "../../utils/setter";
import apiError from "@/store/utils/apiError";
import apiWithLoader from "@/store/utils/apiWithLoader";

// @todo Remove mock data
import mock from "../../mockData";
import { getClass, addClass } from "./getClass";
import { getPartner, addPartner } from "./getPartner";

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
    addClass,
    addPartner,
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
    getClass,
    getPartner,
    async getAllClasses({ commit }) {
      // @todo Replace with API call

      commit("setter", ["classes", mock.classes]);
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
