/**
 * Vuex module for all things classes related
 * Including reviews, points of the classes, and partners
 */

import Vue from "vue";
import router from "@/router";
import moment from "moment";
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
    toggleFavouriteClass(state, classID) {
      /** @notice Toggle state using Vue methods to trigger reactive listeners */
      if (state.favouriteClassesID[classID])
        Vue.delete(state.favouriteClassesID, classID);
      else Vue.set(state.favouriteClassesID, classID, true);
    },
    toggleFavouritePartner(state, partnerID) {
      /** @notice Toggle state using Vue methods to trigger reactive listeners */
      if (state.favouritePartnersID[partnerID])
        Vue.delete(state.favouritePartnersID, partnerID);
      else Vue.set(state.favouritePartnersID, partnerID, true);
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
    addClass(state, classObject) {
      Vue.set(state.classes, classObject.id, classObject);
    },
    addPartner(state, partnerObject) {
      Vue.set(state.partners, partnerObject.id, partnerObject);
    },
    getters: {
      /**
       * @todo Sort by time the class was added as a favourite.
       */
      favouriteClasses(state) {
        const favouriteClasses = [];

        for (const classID of Object.keys(state.favouriteClassesID))
          favouriteClasses.push(state.classes[classID]);

        return favouriteClasses;
      },
      /**
       * @todo Sort by time the class was added as a favourite.
       */
      favouritePartners(state) {
        const favouritePartners = [];

        for (const partnerID of Object.keys(state.favouritePartnersID))
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
          if (state.favouriteClassesID[clas.id]) clas.favourite = true;
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

        for (const classID of Object.keys(state.upcomingClassesID))
          upcomingClasses[classID] = state.classes[classID];

        return Object.values(upcomingClasses).map((clas) => {
          /** @notice Explicit data setting needed to prevent data caching */
          if (state.favouriteClassesID[clas.id]) clas.favourite = true;
          else clas.favourite = false;

          return clas;
        });
      },
    },
    actions: {
      /**
       * Get list of upcomingClassesID from API
       * @function getUpcomingClassesID
       */
      async getUpcomingClassesID({ dispatch, commit }) {
        // @todo Replace with API call
        const upcomingClassesID = mock.upcomingClassesID;

        commit("setter", ["upcomingClassesID", upcomingClassesID]);

        dispatch("getClass", Object.keys(upcomingClassesID));
      },
      /**
       * Get list of pastClassesID from API
       * @function getPastClassesID
       */
      async getPastClassesID({ dispatch, commit }) {
        // @todo Replace with API call
        const pastClassesID = mock.pastClassesID;

        commit("setter", ["pastClassesID", pastClassesID]);

        dispatch("getClass", Object.keys(pastClassesID));
      },
      /**
       * Get favourite classes and partners
       * @function getFavourites
       */
      async getFavouriteClasses({ commit }) {
        // @todo Replace with API call
        const favouriteClassesID = mock.favourites.classes;

        commit("setter", ["favouriteClassesID", favouriteClassesID]);
      },
      /**
       * Get favourite classes and partners
       * @function getFavourites
       */
      async getFavouritePartners({ commit }) {
        // @todo Replace with API call
        const favouritePartnersID = mock.favourites.partners;

        commit("setter", ["favouritePartnersID", favouritePartnersID]);
      },
      async toggleFavouriteClass({ commit }, classID) {
        // Optimistic UI, show toggle first
        commit("toggleFavouriteClass", classID);

        // @todo Call backend and handle error if any to change back favourite value
        // If error from updating server, then call mutation again to toggleBack
        // commit("toggleFavouriteClass", classID);
      },
      async toggleFavouritePartner({ commit }, partnerID) {
        // Optimistic UI, show toggle first
        commit("toggleFavouritePartner", partnerID);

        // @todo Call backend and handle error if any to change back favourite value
        // If error from updating server, then call mutation again to toggleBack
        // commit("toggleFavouritePartner", partnerID);
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
      async getReview({ commit }, classID) {
        // If the review is already in state, ignore it

        // @todo Replace with API call
        // @notice Using shallow copy to prevent deleting value from mock data
        const review = { ...mock.reviews[classID] };

        // @todo To remove once API is done, as API will return result without userReview
        delete review.userReviews;

        commit("setter", ["review", review]);
      },
      async getUserReview({ commit }, classID) {
        // If the review is already in state, ignore it

        // @todo Replace with API call
        const review = mock.reviews[classID];

        commit("setter", ["review", review]);
      },
      async saveNewReview(
        { commit },
        { classID, ratings = 0, description = "" }
      ) {
        // @todo Add API call to send review to server
        console.log("hello in save", classID, ratings, description);
      },
    },
  },
};
