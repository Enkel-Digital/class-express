/**
 * Vuex module for all things classes related including reviews
 */

import initialState from "./initialState";
import setter from "../../utils/setter";
import apiError from "@/store/utils/apiError";
import apiWithLoader from "@/store/utils/apiWithLoader";

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    setter,
  },
  getters: {},
  actions: {
    async getPartnerDetails({ rootState, commit, dispatch }) {
      const response = await apiWithLoader.get(
        `/partner/${rootState.user.partnerID}`
      );
      if (!response.success)
        return apiError(response, () => dispatch("getPartnerDetails"));

      commit("setter", ["partner", response.partner]);
    },
    async getPartnerTags({ rootState, commit, dispatch }) {
      const response = await apiWithLoader.get(
        `/tags/partner/${rootState.user.partnerID}`
      );
      if (!response.success)
        return apiError(response, () => dispatch("getPartnerTags"));

      commit("setter", ["partnerTags", response.tags]);
    },
  },
};
