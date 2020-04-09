/**
 * Vuex module for settings
 */

import initialState from "./initialState";
import setter from "../../utils/setter";

// @todo Remove mock data
// import mock from "../../mockData";

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    setter,
    update(state, { path, value }) {
      const parent = path.slice(-1).reduce((state, key) => {
        return state[key];
      }, state);
      parent[path[path.length - 1]] = value;
    },
    updateSettings(state, newSettings) {
      newSettings.modifiedAt = Date.now();
      state.settings = newSettings;
    }
  },
  actions: {
    /**
     * Initialization function for this module
     * @function init
     */
    async init({ dispatch }) {
      dispatch("syncSettings");
    },
    /**
     * Update settings both locally and remotely
     * @function syncSettings
     */
    async updateSettings({ commit, dispatch }, settings) {
      // @todo Show loading bar before calling API

      console.log("testing");

      // Update state for optimistic UI
      commit("updateSettings", settings);
      // commit("update", { path: [settings], value: settings });

      // Call logic to sync changes with server
      await dispatch("syncSettings");

      // @todo Remove loading bar
    },
    /**
     * save current settings to server
     * @function syncSettings
     */
    async syncSettings({ state }) {
      // Get settings from server and update local state if remote modifiedAt is later than local modifiedAt, else update remote state
      // const remote_modifiedAt = api.settings.getModifiedAt(/* user id here */);
    }
  }
};
