import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import api from "./utils/fetch";

import initialState from "./initialState";
import setter from "./utils/setter";
import errorModule from "./module/error";
import classesModule from "./module/classes";
import searchModule from "./module/search";
import pointsModule from "./module/points";
import newsModule from "./module/news";
import subscriptionPlanModule from "./module/subscriptionPlan";
import settingsModule from "./module/settings";

Vue.use(Vuex);

export default new Vuex.Store({
  state: initialState(),
  modules: {
    error: errorModule,
    classes: classesModule,
    search: searchModule,
    points: pointsModule, // User points and not all points related
    news: newsModule,
    subscription: subscriptionPlanModule,
    settings: settingsModule
  },
  mutations: {
    setter,
    setEmailVerificationStatus(state, status) {
      state.user.emailVerified = status;
    }
  },
  actions: {
    /**
     * Main init function of store that calls all the other init actions from all the modules
     * @function init
     */
    async init({ dispatch }) {
      console.log("Initializing vuex store and its modules...");

      await dispatch("points/init");
      await dispatch("settings/init");
      await dispatch("classes/init");
    },
    /**
     * Function to get all the user's details
     * @function getUserDetails
     */
    async getUserDetails({ commit }, email) {
      email = email.toLowerCase();

      const response = await api.get(`/user/${email}`);
      // @todo Handle error cases
      // if (!response.success) {}
      commit("setter", ["user", response.user]);
    }
  },
  plugins: [createPersistedState()]
});
