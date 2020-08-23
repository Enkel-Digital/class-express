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
  actions: {
    async getEmployees({ commit, dispatch, rootState }) {
      const response = await apiWithLoader.get(
        `/employees/all/${rootState.user.partnerID}`
      );
      if (!response.success)
        return apiError(response, () => dispatch("getEmployees"));

      commit("setter", ["employees", response.employees]);
    },
  },
};
