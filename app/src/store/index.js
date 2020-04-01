import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import initialState from "./initialState";
import setter from "./utils/setter";
import pointsModule from "./module/points";
import newsModule from "./module/news";
import subscriptionPlanModule from "./module/subscriptionPlan";

// @todo Remove these mock data
import mock from "./mockData";

Vue.use(Vuex);

export default new Vuex.Store({
  state: initialState(),
  modules: {
    points: pointsModule,
    news: newsModule,
    subscription: subscriptionPlanModule
  },
  mutations: {
    setter
  },
  actions: {
    /**
     * Main init function of store that calls all the other init actions from all the modules
     * @function init
     */
    async init({ dispatch }) {
      console.log("Initializing vuex store...");
    },
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