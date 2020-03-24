/**
 * Vuex module for the subscription plan view.
 */

import initialState from "./initialState";
import setter from "../../utils/setter";

// @todo Remove mock data
import mock from "../../mockData";

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    setter
  },
  getters: {
    currentPlan(state) {
      return state.subscriptionPlans.find(
        plan => plan.id === state.currentPlanID
      );
    },
    nextPlan(state) {
      return state.subscriptionPlans.find(plan => plan.id === state.nextPlanID);
    }
  },
  actions: {
    /**
     * Initializing function for this module
     * @function init
     */
    async init({ dispatch }) {
      dispatch("getPlans");
      dispatch("getCurrentPlanID");
    },
    /**
     * Get list of available subscription plans from api
     * @function getPlans
     */
    async getPlans({ commit }) {
      // @todo Replace with API call
      const plans = mock.subscriptionPlans;

      commit("setter", ["subscriptionPlans", plans]);
    },
    /**
     * Get ID of current plan
     * @function getPlans
     */
    async getCurrentPlanID({ commit }) {
      // @todo Replace with API call
      const ID = 0;

      commit("setter", ["currentPlanID", ID]);
      commit("setter", ["nextPlanID", ID]);
    },
    /**
     * Update the user's plan
     * @function updatePlan
     */
    async updatePlan({ state, commit }, planID) {
      // If user selects own plan, ignore selection
      if (state.nextPlanID === planID) return;

      if (confirm("Confirm change of Subscription Plan!")) {
        // @todo Show loading bar before calling API for pessimistic UI

        // Call logic to update the plan

        console.log("Plan is updated");

        // Pessimistic UI, show after network update is complete
        commit("setter", ["nextPlanID", planID]);
      }
    }
  }
};
