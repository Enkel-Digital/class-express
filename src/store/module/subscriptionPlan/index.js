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
        return apiError(
          response,
          () => dispatch("getPlans"),
          "Failed to load available subscription plans"
        );

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
        return apiError(
          response,
          () => dispatch("getUserPlans"),
          "Failed to load your subscription plan(s)"
        );

      commit("setter", ["current", response.plans.current]);
      commit("setter", ["next", response.plans.next]);
    },
    /**
     * Update the user's plan
     * @function updatePlan
     */
    async updatePlan({ state, commit, dispatch, rootState }, planID) {
      // If user selects own plan, ignore selection
      // If user does not have next plan, and selected plan is same as current plan, ignore it
      if (!state.next?.planID && state.current?.planID === planID) return;
      // If user have a next plan, and the selected plan is the same as the next plan, ignore it.
      if (state.next?.planID && state.next?.planID === planID) return;

      if (confirm("Confirm change of Subscription Plan!")) {
        // Call API to update the plan
        const response = await apiWithLoader.post("/subscription/update", {
          userID: rootState.user.id,
          subscriptionPlanID: planID,
        });

        if (!response.success)
          return apiError(
            response,
            () => dispatch("updatePlan", planID),
            "Failed to update your plan"
          );

        // Call getPoints just in case this plan update caused an update to points value
        dispatch("points/getPoints", undefined, { root: true });

        // Pessimistic UI, show after network update is complete, using the users' plans the API returned
        commit("setter", ["current", response.plans.current]);
        commit("setter", ["next", response.plans.next]);
      }
    },
    async cancelPlan({ rootState, dispatch, commit }, cancellationReasons) {
      const response = await apiWithLoader.post("/subscription/cancel", {
        userID: rootState.user.id,
        cancellationReasons,
      });

      if (!response.success)
        return apiError(
          response,
          () => dispatch("cancelPlan", cancellationReasons),
          "Failed to cancel your plan"
        );

      // Indicate that this is the last plan and there will no longer be any next plan
      commit("setter", ["nextPlan", undefined]);
    },
  },
};
