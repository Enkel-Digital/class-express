/**
 * Vuex module for points and topup related actions
 */

import initialState from "./initialState";
import setter from "../../utils/setter";

// @todo Remove mock data
import mock from "../../mockData";

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    setter,
    topupPoints(state, pointsBought) {
      state.points.left += pointsBought;
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
      await dispatch("getPoints");
    },
    /**
     * Get list of available topup options from api
     * @function getPlans
     */
    async getPoints({ commit }) {
      // @todo Replace with API call
      const points = mock.points;

      commit("setter", ["points", points]);
    },
    /**
     * Get list of available topup options from api
     * @function getPlans
     */
    async getTopupOptions({ commit }) {
      // @todo Replace with API call
      const topupOptions = mock.topupOptions;

      commit("setter", ["topupOptions", topupOptions]);
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
