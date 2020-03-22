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
  mutations: {
    // See if there is any other way to do this type of setters
    setUser(state, user) {
      state.user = user;
    },
    setPoints(state, points) {
      state.points = points;
    }
  },
  actions: {
    /**
     * Function to get all the user's details
     * @function getUserDetails
     */
    async getUserDetails({ commit }) {
      commit("setUser", mock.user);
      commit("setPoints", mock.points);
    }
  },
  plugins: [createPersistedState()]
});
