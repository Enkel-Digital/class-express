/**
 * Vuex module for all things classes related including reviews
 */

import initialState from "./initialState";
import setter from "../../utils/setter";
import apiError from "@/store/utils/apiError";
import apiWithLoader from "@/store/utils/apiWithLoader";
// @todo Remove mock data
import mock from "../../mockData";

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    setter,
  },
  getters: {},
  actions: {
    async getPartnerDetails({ state, commit, dispatch }, partnerID) {
      const response = await apiWithLoader.get(`/partner/${partnerID}`);
      if (!response.success)
        return apiError(response, () => dispatch("getPartnerDetails"));

      commit("setter", ["partner", response.partner]);
    },
    async getPartnerTags({ state, commit, dispatch }, partnerID) {
      const response = await apiWithLoader.get(`/tags/partner/${partnerID}`);
      if (!response.success)
        return apiError(response, () => dispatch("getPartnerTags"));

      commit("setter", ["partnerTags", response.tags]);
    },
  },
};
