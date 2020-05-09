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
    setter,
  },
  actions: {
    /**
     * Initialization function for this module
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
    },
    viewBanner(_, link) {
      if (!link) return;

      // // @todo Fix this hack that prevents double click
      // console.log("testing");
      // console.log("clcked", link);
      // if (this.lastViewdBanner_tmp === link) return;
      // this.lastViewdBanner_tmp = link;

      if (confirm("Checkout link?")) window.open(link);
    },
  },
};
