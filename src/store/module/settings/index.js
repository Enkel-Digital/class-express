/**
 * Vuex module for settings
 */

import initialState from "./initialState";
import setter from "../../utils/setter";
import unixseconds from "unixseconds";
import apiError from "@/store/utils/apiError";
import apiWithLoader from "@/store/utils/apiWithLoader";

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    setter,
    updateSettings(state, newSettings) {
      // Only add modifiedAt if it is on the object already
      state.modifiedAt = unixseconds();
      state.settings = newSettings;
    },
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
     * Sync settings from API to local and local to API
     * @function syncSettings
     *
     * @todo Get settings from server and update local state only if remote modifiedAt is later than local modifiedAt, else update remote state
     */
    async syncSettings({ state, rootState, commit, dispatch }, settings) {
      // If settings passed in, means to update remote with new user settings if local settings is later then remote settings
      if (settings) {
        const originalSettings = state.settings;

        // Update state first for optimistic UI and also to inject in modifiedAt value
        commit("updateSettings", settings);

        // Call API after modifiedAt is injected in the "updateSettings" mutation
        const response = await apiWithLoader.post("/settings/update", {
          userID: rootState.user.id,
          settings,
          modifiedAt: state.modifiedAt,
        });

        // Only handle failure cases, as UI has already been updated optimistically
        if (!response.success) {
          // If the server has a later version of settings and returned it, set that as the settings instead.
          if (response.latest) commit("updateSettings", response.settings);
          // Else if API just fails
          else {
            // Revert settings back to original settings
            commit("updateSettings", originalSettings);
            return apiError(
              response,
              () => dispatch("syncSettings"),
              "Failed to sync settings"
            );
          }
        }
      } else {
        // If not settings passed in, means to get latest settings from server
        const response = await apiWithLoader.get(
          `/settings/user/${rootState.user.id}`
        );

        if (!response.success)
          return apiError(
            response,
            () => dispatch("syncSettings"),
            "Failed to sync settings"
          );

        // Set the modified at from the server
        commit("setter", ["modifiedAt", response.settings?.modifiedAt]);

        // Detach modifiedAt from settings before saving settings into state
        delete response.settings?.modifiedAt;
        commit("updateSettings", response.settings);
      }
    },
  },
};
