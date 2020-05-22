/**
 * Vuex module for points and topup related actions
 */

import initialState from "./initialState";
import setter from "../../utils/setter";
import loader from "@/store/utils/loader";
import apiError from "@/store/utils/apiError";
import api from "@/store/utils/fetch";

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
     * Get list of available topup options from api
     * @function getPlans
     */
    async getPoints({ commit, rootState }) {
      // Wait until email is available.
      // @todo Might cause issues if the user API fails this will continue looping forever.
      while (!rootState.user.email) {
        const sleep = (await import("@/utils/sleep")).default;
        await sleep.milli(100);
      }

      const response = await api.get(`/points/${rootState.user.email}`);
      if (!response.success); // @todo Handle error

      commit("setter", ["points", response.points]);
    },
    /**
     * Get list of available topup options from api
     * @function getPlans
     */
    async getTopupOptions({ commit }) {
      const response = await api.get("/topup/options");
      if (!response.success); // @todo Handle error

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

        // Pessimistic UI, show after network update is complete
        commit("topupPoints", points);
      }
    },
  },
};
