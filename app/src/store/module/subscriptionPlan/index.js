/**
 * Vuex module for the subscription plan view.
 *
 * @todo Remove this state from being cached by vuex-persistedstate
 */

import initialState from "./initialState";
import setter from "../../utils/setter";
import apiError from "@/store/utils/apiError";
import api from "@/store/utils/fetch";
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
        `/subscription/${rootState.user.email}`
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
        // Show loading bar before calling API for pessimistic UI
        // const loaderID = await loader.new();

        // Call API to update the plan
        const response = await api.post("/subscription/plans/update", {
          userID: rootState.user.email,
          subscriptionPlanID: planID,
        });

        // Remove loader after API responds
        // loader.clear(loaderID);

        // @todo Handle error
        if (!response.success);

        // @todo Remove before beta
        console.log("Plan is updated");

        // Pessimistic UI, show after network update is complete, using the users' plans the API returned
        commit("setter", ["currentPlanID", response.plans.currentPlanID]);
        commit("setter", ["nextPlanID", response.plans.nextPlanID]);
      }
    },
    async cancelPlan({ rootState, commit }, cancellationReasons) {
      const response = await api.post("/subscription/cancel", {
        userID: rootState.user.userID,
        cancellationReasons,
      });

      // @todo
      if (response.success) {
        // Indicate that this is the last plan and there will no longer be any next plan
        commit("setter", ["nextPlanID", null]);
      } else {
        // error dialog
      }
    },
  },
};
