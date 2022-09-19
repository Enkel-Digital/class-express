/**
 * Vuex module for partner related things.
 */

import initialState from "./initialState";
import setter from "../../utils/setter";
import apiError from "@/store/utils/apiError";
import apiWithLoader from "@/store/utils/apiWithLoader";

export default {
  namespaced: true,
  // @todo Do we need the initialState for this module?
  state: initialState(),
  mutations: { setter },
  actions: {
    async getPartnerDetails({ rootState, commit, dispatch }) {
      const response = await apiWithLoader.get(
        `/partner/${rootState.user.partnerID}`
      );
      if (!response.success)
        return apiError(response, () => dispatch("getPartnerDetails"));

      commit("setter", ["partner", response.partner]);
    },
  },
};
