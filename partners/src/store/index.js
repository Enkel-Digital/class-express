import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import initialState from "./initialState";
import setter from "./utils/setter";
import classesModule from "./module/classes";
import bookingsModule from "./module/bookings";
import employeesModule from "./module/employees";
import searchModule from "./module/search";
import pointsModule from "./module/points";
import newsModule from "./module/news";
import subscriptionPlanModule from "./module/subscriptionPlan";
import earningsHistoryModule from "./module/earningsHistory";

// @todo Remove these mock data
import mock from "./mockData";

Vue.use(Vuex);

export default new Vuex.Store({
  state: initialState(),
  modules: {
    classes: classesModule,
    bookings: bookingsModule,
    employees: employeesModule,
    search: searchModule,
    points: pointsModule, // User points and not all points related
    news: newsModule,
    subscription: subscriptionPlanModule,
    earningsHistory: earningsHistoryModule,
  },
  mutations: {
    setter,
  },
  actions: {
    /**
     * Main init function of store that calls all the other init actions from all the modules
     * @function init
     */
    async init({ dispatch }) {
      console.log("Initializing vuex store and its modules...");

      await dispatch("points/init");
    },
    /**
     * Function to get all the user's details
     * @function getUserDetails
     */
    async getUserDetails({ commit }) {
      commit("setter", ["user", mock.user]);
    },
  },
  plugins: [createPersistedState()],
});
