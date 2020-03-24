/**
 * Vuex module for news/featured Banners in Home view/screen
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
     * Initializing function for this module
     * @function init
     */
    async init({ dispatch }) {
      dispatch("getNewsBanners");
    },
    /**
     * Get list of available subscription plans from api
     * @function getPlans
     */
    async getNewsBanners({ commit }) {
      // @todo Replace with API call
      const newsBanners = mock.newsBanners;

      commit("setter", ["newsBanners", newsBanners]);
    }
  }
};
