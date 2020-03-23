import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import initialState from "./initialState";
import setter from "./utils/setter";
import subscriptionPlanModule from "./module/subscriptionPlan";

// @todo Remove these mock data
import mock from "./mockData";

Vue.use(Vuex);

export default new Vuex.Store({
  state: initialState(),
  modules: {
    subscription: subscriptionPlanModule
  },
  mutations: {
    setter
  },
  actions: {
    /**
     * Function to get all the user's details
     * @function getUserDetails
     */
    async getUserDetails({ commit }) {
      commit("setter", ["user", mock.user]);
      commit("setter", ["points", mock.points]);
    }
  },
  plugins: [createPersistedState()]
});
