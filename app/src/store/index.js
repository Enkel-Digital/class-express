import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import initialState from "./initialState";
import subscriptionPlanModule from "./module/subscriptionPlan";

// @todo Remove these mock data
import mock from "./mockData";

Vue.use(Vuex);

export default new Vuex.Store({
  state: initialState(),
  modules: {
    subscription: subscriptionPlanModule
  },
  mutations: {},
  actions: {
    /**
     * Function to get all the user's details
     * @function getUserDetails
     */
    async getUserDetails({ state }) {
      state.user = mock.user;
      state.points = mock.points;
    }
  },
  plugins: [createPersistedState()]
});
