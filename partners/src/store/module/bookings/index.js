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
    async getBookings({ state, commit, dispatch }, partnerID) {
      const response = await apiWithLoader.get(`/bookings/all/${partnerID}`);
      if (!response.success)
        return apiError(response, () => dispatch("getBookings"));

      console.log("bookings", response);

      commit("setter", ["booking", response.bookingsOfPartner]);
    },
  },
};
