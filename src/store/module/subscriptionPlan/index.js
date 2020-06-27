/**
 * Vuex module for the subscription plan view.
 *
 * @todo Remove this state from being cached by vuex-persistedstate
 */

import initialState from "./initialState";
import setter from "../../utils/setter";
import apiError from "@/store/utils/apiError";
import apiWithLoader from "@/store/utils/apiWithLoader";

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    setter,
  },
  actions: {
    /**
     * Initialization function for this module
     * @function init
     */
    async init({ dispatch }) {
      dispatch("getUserPlans");
    },
    /**
     * Get list of available subscription plans from api
     * @function getPlans
     */
    async getPlans({ commit, dispatch }) {
      const response = await apiWithLoader.get("/subscription/plans/all");
      if (!response.success)
        return apiError(response, () => dispatch("getPlans"));

      commit("setter", ["subscriptionPlans", response.subscriptionPlans]);
    },
    /**
     * Get ID of current plan
     * @function getPlans
     */
    async getUserPlans({ commit, rootState, dispatch }) {
      const response = await apiWithLoader.get(
        `/subscription/${rootState.user.id}`
      );
      if (!response.success)
        return apiError(response, () => dispatch("getUserPlans"));

      commit("setter", ["currentPlan", response.plans.currentPlan]);
      commit("setter", ["nextPlan", response.plans.nextPlan]);
    },
    /**
     * Update the user's plan
     * @function updatePlan
     */
    async updatePlan({ state, commit, dispatch, rootState }, planID) {
      // If user selects own plan, ignore selection
      if (state.nextPlanID === planID) return;

      if (confirm("Confirm change of Subscription Plan!")) {
        // Call API to update the plan
        const response = await apiWithLoader.post(
          "/subscription/plans/update",
          {
            userID: rootState.user.id,
            subscriptionPlanID: planID,
          }
        );

        if (!response.success)
          return apiError(response, () => dispatch("updatePlan", planID));

        // Pessimistic UI, show after network update is complete, using the users' plans the API returned
        commit("setter", ["currentPlanID", response.plans.currentPlanID]);
        commit("setter", ["nextPlanID", response.plans.nextPlanID]);
      }
    },
    async cancelPlan({ rootState, dispatch, commit }, cancellationReasons) {
      const response = await apiWithLoader.post("/subscription/cancel", {
        userID: rootState.user.id,
        cancellationReasons,
      });

      if (!response.success)
        return apiError(response, () =>
          dispatch("cancelPlan", cancellationReasons)
        );

      // Indicate that this is the last plan and there will no longer be any next plan
      commit("setter", ["nextPlanID", null]);
    },
  },
};
