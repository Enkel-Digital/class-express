/**
 * Vuex module for points and topup related actions
 */

import initialState from "./initialState";
import setter from "../../utils/setter";
import apiWithLoader from "@/store/utils/apiWithLoader";
import apiError from "@/store/utils/apiError";

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    setter,
    topupPoints(state, pointsBought) {
      state.points.left += pointsBought;
    },
    /**
     * Function to deduct points needed to book a class
     * @function deductPoints
     * @param {*} state
     * @param {number} classPoints Points needed for the class
     */
    deductPoints(state, classPoints) {
      state.points.left -= classPoints;
    },
    /**
     * Function to refund back points from a class booking
     * @function refundPoints
     * @param {*} state
     * @param {number} classPoints Points needed for the class
     */
    refundPoints(state, classPoints) {
      state.points.left += classPoints;
    },
  },
  getters: {
    topupOption: (state) => (topupOptionID) =>
      state.topupOptions.find(
        (topupOption) => topupOption.id === topupOptionID
      ),
  },
  actions: {
    /**
     * Initialization function for this module
     * @function init
     */
    async init({ dispatch }) {
      dispatch("getPoints");
    },
    /**
     * Get list of available topup options
     * @function getPlans
     */
    async getPoints({ commit, dispatch, rootState }) {
      // Wait until email is available.
      // @todo Might cause issues if the user API fails this will continue looping forever.
      // @todo Update this to throw error instead if email is not available
      while (!rootState.user.id) {
        const sleep = (await import("@/utils/sleep")).default;
        await sleep.milli(100);
      }

      const response = await apiWithLoader.get(`/points/${rootState.user.id}`);

      if (!response.success)
        return apiError(response, () => dispatch("getPoints"));

      commit("setter", ["points", response.points]);
    },
    /**
     * Get list of available topup options
     * @function getPlans
     */
    async getTopupOptions({ commit, dispatch }) {
      const response = await apiWithLoader.get("/topup/options");

      if (!response.success)
        return apiError(response, () => dispatch("getTopupOptions"));

      commit("setter", ["topupOptions", response.topupOptions]);
    },
    /**
     * Buy/Topup points
     * @function buyPoints
     */
    async buyPoints({ commit, getters }, topupOptionID) {
      const points = getters.topupOption(topupOptionID).totalPoints;

      // Set the selected Plan to show on the radio buttons
      console.log(`Requested ${points} points topup, option ${topupOptionID}`);

      if (confirm("Confirm topup?")) {
        // @todo Show loading bar before calling API for pessimistic UI

        // Call logic to topup points

        console.log("Points added!");

        commit("topupPoints", points);
      }
    },
  },
};
