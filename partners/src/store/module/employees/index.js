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
    async getEmployees({ state, commit, dispatch }, partnerID) {
      const response = await apiWithLoader.get(`/employees/all/${partnerID}`);
      if (!response.success)
        return apiError(response, () => dispatch("getEmployees"));

      console.log("employees", response);

      commit("setter", ["employee", response.employees]);
    },
  },
};
