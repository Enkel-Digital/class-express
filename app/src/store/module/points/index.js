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
      state.points.total += pointsBought;
    },
    /**
     * Function to deduct points needed to book a class
     * @param {number} classPoints Points needed for the class
     */
    deductPoints(state, classPoints) {
      state.points.left -= classPoints;
    },
    /**
     * Function to refund back points from a class booking
     * @param {number} classPoints Points needed for the class
     */
    refundPoints(state, classPoints) {
      state.points.left += classPoints;
    },
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
      const response = await apiWithLoader.get(`/points/${rootState.user.id}`);

      if (!response.success)
        return apiError(
          response,
          () => dispatch("getPoints"),
          "Failed to load your points"
        );

      commit("setter", ["points", response.points]);
    },
    /**
     * Get list of available topup options
     * @function getPlans
     */
    async getTopupOptions({ commit, dispatch }) {
      const response = await apiWithLoader.get("/topup/options");

      if (!response.success)
        return apiError(
          response,
          () => dispatch("getTopupOptions"),
          "Failed to get topup options"
        );

      commit("setter", ["topupOptions", response.topupOptions]);
    },
    /**
     * Buy/Topup points
     * @function buyPoints
     */
    async buyPoints({ state, commit, rootState, dispatch }, topupID) {
      const points = state.topupOptions.find(
        (topupOption) => topupOption.id === topupID
      ).totalPoints;

      // Set the selected Plan to show on the radio buttons
      console.log(`Requested ${points} points topup, option ${topupID}`);

      if (confirm("Confirm topup?")) {
        // Call API to topup points
        const response = await apiWithLoader.post("/topup/purchase", {
          userID: rootState.user.id,
          topupID,
        });

        if (!response.success)
          return apiError(
            response,
            () => dispatch("buyPoints", topupID),
            "Failed to buy points"
          );

        commit("topupPoints", points);

        // @todo Maybe should get back points topped up from API, and/or get back the total points
        // To ensure the front end view is consistent with the data stored.
        // commit("topupPoints", response.points);
      }
    },
  },
};
