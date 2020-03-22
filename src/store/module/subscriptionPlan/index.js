/**
 * Vuex module for the subscription plan view.
 */

import initialState from "./initialState";

// @todo Remove mock data
import mock from "../../mockData";

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    setPlans(state, subscriptionPlans) {
      state.subscriptionPlans = subscriptionPlans;
    }
  },
  actions: {
    /**
     * Get list of available subscription plans from api
     * @function getPlans
     */
    async getPlans({ commit }) {
      // @todo Replace with API call
      const plans = mock.subscriptionPlans;

      commit("setPlans", plans);
    }
  }
};
