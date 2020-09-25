import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import apiWithLoader from "@/store/utils/apiWithLoader";
import apiError from "@/store/utils/apiError";

import initialState from "./initialState";
import setter from "./utils/setter";

import classesModule from "./module/classes";
import pointsModule from "./module/points";
import subscriptionPlanModule from "./module/subscriptionPlan";
import settingsModule from "./module/settings";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV.toLowerCase() !== "production",
  state: initialState(),
  modules: {
    classes: classesModule,
    points: pointsModule, // User points and not all points related
    subscription: subscriptionPlanModule,
    settings: settingsModule,
  },
  mutations: {
    setter,
    setEmailVerificationStatus(state, status) {
      state.user.emailVerified = status;
    },
  },
  actions: {
    /**
     * Main init function of store that calls all the other init actions from all the modules
     * @function init
     */
    async init({ dispatch }) {
      console.log("Initializing vuex store and its modules...");

      dispatch("subscription/init");
      dispatch("points/init");
    },
    /**
     * Function to get basic user's details
     * @function getUserDetails
     */
    async getUserDetails({ commit }, email) {
      email = email.toLowerCase();

      const response = await apiWithLoader.get(`/user/${email}`);
      if (!response.success)
        return apiError(
          response,
          (self) => self.$store.dispatch("getUserDetails", email),
          "Failed to load your user details. Unable to proceed. Please logout and re-login."
        );

      commit("setter", ["user", response.user]);
    },
  },
  plugins: [
    /* Note that createPersistedState use the same key "vuex" in storage, but they do not clash as they use different storage APIs */
    // Register modules for persistent state using localStorage
    createPersistedState({
      paths: ["user", "points", "settings", "subscription"],
    }),
    // Register modules for persistent state using sessionStorage
    createPersistedState({
      storage: window.sessionStorage,
      paths: ["classes"],
    }),
  ],
});
