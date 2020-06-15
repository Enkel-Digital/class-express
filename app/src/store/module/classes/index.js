/**
 * Vuex module for all things classes related
 * Including reviews, points of the classes, and partners
 */

import Vue from "vue";
import router from "@/router";
import initialState from "./initialState";
import setter from "../../utils/setter";
import apiError from "@/store/utils/apiError";
import apiWithLoader from "@/store/utils/apiWithLoader";

import { getClass, addClass } from "./getClass";
import { getPartner, addPartner } from "./getPartner";

// import getClassSchedule from "./getClassSchedule";
// import getPartnerSchedule from "./getPartnerSchedule";

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    setter,
    toggleFavouriteClass(state, classID) {
      /** @notice Toggle state using Vue methods to trigger reactive listeners */
      if (state.favouriteClasses[classID])
        Vue.delete(state.favouriteClasses, classID);
      else Vue.set(state.favouriteClasses, classID, true);
    },
    toggleFavouritePartner(state, partnerID) {
      /** @notice Toggle state using Vue methods to trigger reactive listeners */
      if (state.favouritePartners[partnerID])
        Vue.delete(state.favouritePartners, partnerID);
      else Vue.set(state.favouritePartners, partnerID, true);
    },
    setUpcomingClass(state, { classID, action, timestamp }) {
      /** @notice Change state using Vue methods to trigger reactive listeners */
      // @todo Change set and delete to use the specific timestamp of that class
      if (action) Vue.set(state.upcomingClassesID, classID, true);
      else Vue.delete(state.upcomingClassesID, classID);
    },
    clearUserReview(state) {
      // Clear reviews to prevent caching in memory
      Vue.delete(state.review, "userReviews");
    },
    addClass,
    addPartner,
    addClassSchedule(state, schedule) {
      Vue.set(state.schedule.class, schedule.classID, schedule);
    },
    addPartnerSchedule(state, schedule) {
      Vue.set(state.schedule.partner, schedule.partnerID, schedule);
    },
  },
  getters: {
    /**
     * @todo Sort by time the class was added as a favourite.
     */
    favouriteClasses(state) {
      const favouriteClasses = [];

      for (const classID of Object.keys(state.favouriteClasses))
        favouriteClasses.push(state.classes[classID]);

      return favouriteClasses;
    },
    /**
     * @todo Sort by time the class was added as a favourite.
     */
    favouritePartners(state) {
      const favouritePartners = [];

      for (const partnerID of Object.keys(state.favouritePartners))
        favouritePartners.push(state.partners[partnerID]);

      return favouritePartners;
    },
    /**
     * @todo Sort by time class was attended
     * @todo As time goes on, this will get larger and larger, thus we need a better way to pass this to the view component, instead of everything at once.
     */
    pastClasses(state) {
      // If pastClassesID is not loaded before getter is ran, skip getter.
      if (!state.pastClassesID) return [];

      const pastClasses = {};

      for (const classID of Object.keys(state.pastClassesID))
        pastClasses[classID] = state.classes[classID];

      return Object.values(pastClasses).map((clas) => {
        /** @notice Explicit data setting needed to prevent data caching */
        if (state.favouriteClasses[clas.id]) clas.favourite = true;
        else clas.favourite = false;

        return clas;
      });
    },
    /**
     * Generate an array of upcoming classes Object(s) from an array of IDs of upcoming classes
     * @todo Sort the classes by time of class for every day.
     * @todo Return an Object with timestamp as key and an array of classes as value
     */
    upcomingClasses(state) {
      const upcomingClasses = {};

      for (const classID in state.upcomingClassesID)
        upcomingClasses[classID] = state.classes[classID];

      return Object.values(upcomingClasses)
        .filter((clas) => clas) // Filters out undefined classes that are yet to be fetched from API
        .map((clas) => {
          /** @notice Explicit data setting needed to prevent data caching */
          if (state.favouriteClasses[clas.id]) clas.favourite = true;
          else clas.favourite = false;

          return clas;
        });
    },
  },
  actions: {
    getClass,
    getPartner,
    /**
     * Get list of upcomingClasses from API
     * @function getUpcomingClasses
     */
    async getUpcomingClasses({ rootState, dispatch, commit }) {
      const response = await apiWithLoader.get(
        `/class/user/upcoming/${rootState.user.email}`
      );

      if (!response.success)
        return apiError(response, () => dispatch("getUpcomingClasses"));

      const upcomingClasses = response.upcomingClasses;

      // @todo Instead of storing in upcoming classes, store it in userClasses
      // when I call api for upcoming, give upcoming at READ TIME
      // However store it in userClasses, then differentiate them to be either upcoming or past classes depending on the current time of display
      // If I call past classes, API gets past classes filtering by READ TIME, then store in past classes
      // past classes might not be accurate too, as a upcomingClass can become a past class while using the app,
      commit("setter", ["upcomingClasses", upcomingClasses]);

      // @todo Does this still work?
      dispatch("getClass", Object.keys(upcomingClasses));
    },
    /**
     * Get list of pastClasses from API
     * @function getPastClasses
     */
    async getPastClasses({ state, dispatch, commit }) {
      // @todo Replace with API call
      // commit("setter", ["pastClasses", pastClasses]);
      // dispatch("getClass", Object.keys(pastClassesID));
    },
    /**
     * Call API for BOTH favourite classes and partners
     * Both tied together as thats how the DB data is structured and how the API works
     * @function getFavourites
     */
    async getFavourites({ state, commit, dispatch, rootState }) {
      // @todo Now we always call the API, but to udpate by sending the API the last update time
      const response = await apiWithLoader.get(
        `/favourites/${rootState.user.email}`
      );

      if (!response.success)
        return apiError(response, () => dispatch("getFavourites"));

      commit("setter", ["favouriteClasses", response.favourites.classes]);
      dispatch("getClass", Object.keys(response.favourites.classes));

      commit("setter", ["favouritePartners", response.favourites.partners]);
      dispatch("getPartner", Object.keys(response.favourites.partners));
    },
    async toggleFavouriteClass(
      { state, rootState, commit, dispatch },
      classID
    ) {
      // Optimistic UI, show toggle first
      commit("toggleFavouriteClass", classID);

      const response = await apiWithLoader.post("/favourites/classes/update", {
        userID: rootState.user.email,
        classID,
        favourite: state.favouriteClasses[classID], // The value in state after the toggle
      });

      // On error change back favourite value first using the toggle mutation
      if (!response.success) {
        commit("toggleFavouriteClass", classID);
        return apiError(response, () => dispatch("toggleFavouriteClass"));
      }
    },
    async toggleFavouritePartner(
      { state, rootState, commit, dispatch },
      partnerID
    ) {
      // Optimistic UI, show toggle first
      commit("toggleFavouritePartner", partnerID);

      const response = await apiWithLoader.post("/favourites/partner/update", {
        userID: rootState.user.email,
        partnerID,
        favourite: state.favouritePartners[partnerID], // The value in state after the toggle
      });

      // On error change back favourite value first using the toggle mutation
      if (!response.success) {
        commit("toggleFavouritePartner", partnerID);
        return apiError(response, () => dispatch("toggleFavouritePartner"));
      }
    },
    async reserveClass({ state, rootState, commit }, classID) {
      const { points: classPoints } = state.classes[classID];
      const userPoints = rootState.points.points;

      // Check if user have enough points for the class
      if (userPoints.left < classPoints) {
        // redirect to topup view
        if (confirm("Not enough points, topup?"))
          router.push({ name: "topup" });
      } else if (confirm(`Reserve class for ${classPoints} points?`)) {
        // @todo Show loading UI while making call to API

        // @todo Add API call to set upcoming class
        // @notice API logic should deduct points too, but locally update it without checking API

        /** @notice Pessimistic UI, commit changes after API call is successful */
        commit("setUpcomingClass", { classID, action: true, timestamp: "" });

        // Deduct points
        commit("points/deductPoints", classPoints, { root: true });

        // @todo Handle API failures

        // @todo Remove loading UI after API call is done
      }
    },
    async cancelClass({ state, rootState, commit }, classID) {
      const { points: classPoints } = state.classes[classID];

      // @todo User obviously cannot cancel when the class is in progress or after it ended
      // @todo Add time check to ensure user knows that we will charge him extra if cancelling late

      if (confirm("Cancel your reservation?")) {
        // @todo Show loading UI while making call to API

        // @todo Add API call to cancel upcoming class
        // @notice API logic should add back points too, but locally update it without checking API

        /** @notice Pessimistic UI, commit changes after API call is successful */
        commit("setUpcomingClass", { classID, action: false, timestamp: "" });

        // Refund back the points
        commit("points/refundPoints", classPoints, { root: true });

        // @todo Handle API failures

        // @todo Remove loading UI after API call is done
      }
    },
    // @todo Update to get only the basic review data instead of using the whole reviews object
    // API should return result without userReview
    async getReview({ state, commit, dispatch }, classID) {
      // If review is already in state, ignore request
      if (state.review && classID === state.review[classID]) return;

      const response = await apiWithLoader.get(`/reviews/class/${classID}`);
      if (!response.success)
        return apiError(response, () => dispatch("getReview"));

      commit("setter", ["review", response.reviews]);
    },
    // @todo Update to get userReviews instead of using the current reviews API
    async getUserReview({ state, commit, dispatch }, classID) {
      // If review is already in state, ignore request
      if (state.review && classID === state.review[classID]) return;

      const response = await apiWithLoader.get(`/reviews/class/${classID}`);
      if (!response.success)
        return apiError(response, () => dispatch("getReview"));

      commit("setter", ["review", response.reviews]);
    },
    async saveNewReview(
      { commit },
      { classID, ratings = 0, description = "" }
    ) {
      // @todo Add API call to send review to server
      console.log("hello in save", classID, ratings, description);
    },
  },
};
