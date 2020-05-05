/**
 * Vuex module for search result and the explore page
 */

import initialState from "./initialState";
import setter from "../../utils/setter";

// @todo Remove mock data
import mock from "../../mockData";

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    setter
  },
  actions: {
    /**
     * Get list of categories
     * @function getCategories
     */
    async getCategories({ commit }) {
      // @todo Replace with API
      commit("setter", ["categories", mock.categories]);
    }
  }
};
