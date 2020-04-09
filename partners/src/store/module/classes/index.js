/**
 * Vuex module for all things classes related
 *
 * Including reviews and points of this class
 *
 *
 * IMP
 * The class state that is cached on the app, should be an object
 * where the class ID is the key
 *
 * in fact everything should be object to have a flat access method.
 * instead of arrays where I have to look through all of them. The objects give me direct access.
 *
 * If i need in array form, just get the keys or enumerate some other way.
 * Object.keys is a great way to do it.
 * Then sort the array if needed, or sorting while I enumerate is fine too.
 * Sorting after array is created is much more liberal and generalisable.
 *
 * everytime I get new class data from server, I just cache it by storing it into the store.
 *
 *
 */

import Vue from "vue";
import moment from "moment";
import initialState from "./initialState";
import setter from "../../utils/setter";
import getClass from "./getClass";
import createGMapsImg from "./gMapsImage";

// @todo Remove mock data
import mock from "../../mockData";

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    setter,
    toggleFavourite(state, classID) {
      /** @notice Toggle state using Vue methods to trigger reactive listeners */
      if (state.favouriteClassesID[classID])
        Vue.delete(state.favouriteClassesID, classID);
      else Vue.set(state.favouriteClassesID, classID, true);

      /** @notice Alternate solution to using Vue.set and Vue.delete is to do a shallow copy for reactive triggers */
      // if (state.favouriteClassesID[classID])
      //   delete state.favouriteClassesID[classID];
      // else state.favouriteClassesID[classID] = true;
      // // For reactivity
      // state.favouriteClassesID = { ...state.favouriteClassesID };
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
    updateClassesToFetch(state, { classID, add, remove }) {
      if (add) Vue.set(state.classesToFetch, classID, true);
      else if (remove) Vue.delete(state.classesToFetch, classID);
      else throw new Error("Invalid action used on updateClassesToFetch");
    },
    class(state, { classObject, add, remove }) {
      if (add) Vue.set(state.classes, classObject.id, classObject);
      else if (remove) Vue.delete(state.classes, classObject.id);
      else throw new Error("Invalid action used on updateClassesToFetch");
    }
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
     * @todo Sort by time class was attended
     */
    pastClasses(state) {
      // If pastClassesID is not loaded before getter is ran, skip getter.
      if (!state.pastClassesID) return [];

      const pastClasses = {};

      for (const classID of Object.keys(state.pastClassesID))
        pastClasses[classID] = state.classes[classID];

      return Object.values(pastClasses).map(clas => {
        clas.locationImage = createGMapsImg(clas.location.coordinates);

        /** @notice Explicit data setting needed to prevent data caching */
        if (state.favouriteClassesID[clas.id]) clas.favourite = true;
        else clas.favourite = false;

        return clas;
      });
    },
    /**
     * Generate an array of upcoming classes Object(s) from an array of IDs of upcoming classes
     * @todo Sort the classes by time of class.
     */
    upcomingClasses(state) {
      const upcomingClasses = {};

      // to sort it, get all the timestamp of the classes and the class ID into an array of object first
      // const upcomingClassesTimestamp = [];
      // for (const classID in state.upcomingClassesID)
      //   upcomingClassesTimestamp.push({
      //     classID,
      //     ts: state.classes[classID].timestamp
      //   });

      for (const classID of Object.keys(state.upcomingClassesID))
        upcomingClasses[classID] = state.classes[classID];

      return Object.values(upcomingClasses).map(clas => {
        clas.locationImage = createGMapsImg(clas.location.coordinates);

        /** @notice Explicit data setting needed to prevent data caching */
        if (state.favouriteClassesID[clas.id]) clas.favourite = true;
        else clas.favourite = false;

        return clas;
      });
    }
  },
  actions: {
    /**
     * Initialization function for this module
     * @function init
     */
    async init({ commit, dispatch }) {
      /**
       * @todo Remove this once the class addition is built.
       * @todo Edit "vuex-persistedstate" plugin to ignore class objects as they should be fetched everytime.
       */
      commit("setter", ["classes", mock.classes]);

      // Do I really need these 2 or can just put in created of the views
      await dispatch("getUpcomingClassesID");
      await dispatch("getFavouriteClassesID");
    },
    /**
     * Add a classID to "Queue" to get the details fetched
     * @function getClass
     *
     * @example this.$store.dispatch("points/getClass", classID); // When using from a component
     * @example dispatch("getClass", classID); // When using in actions from this module
     *
     * @todo remove setter call in init action
     * @todo everytime I need a class, trigger this action to push classID in and fetch the class from API
     */
    async getClass({ state, commit }, classID) {
      console.log("getClass called", classID);

      // Loop over all classIDs if input is an array of classIDs
      if (Array.isArray(classID))
        for (const id of classID) getClass({ state, commit }, id);
      else getClass({ state, commit }, classID);
    },
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
     * Get list of favouriteClasses from API
     * @function getFavouriteClasses
     */
    async getFavouriteClassesID({ dispatch, commit }) {
      // @todo Replace with API call
      const favouriteClassesID = mock.favouriteClassesID;

      commit("setter", ["favouriteClassesID", favouriteClassesID]);

      dispatch("getClass", Object.keys(favouriteClassesID));
    },
    async toggleFavourite({ commit }, classID) {
      // Optimistic UI, show toggle first
      commit("toggleFavourite", classID);

      // Call backend and handle error if any to change back favourite value

      // If error from updating server, then call mutation again to toggleBack
      // commit("toggleFavourite", classID);
    },
    async reserveClass({ state, commit }, classID) {
      if (confirm(`Reserve class for ${state.classes[classID].points} points?`))
        commit("setUpcomingClass", { classID, action: true, timestamp: "" });
    },
    async cancelClass({ commit }, classID) {
      if (confirm("Cancel your reservation?"))
        commit("setUpcomingClass", { classID, action: false, timestamp: "" });
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
    async getSchedule(
      { commit },
      { classID, dateCursor = moment.utc().startOf("day") }
    ) {
      // If schedule is already in state, ignore it

      // If the current date cursor is today, get schedules for the next 5 days
      if (dateCursor === moment.utc().startOf("day")) {
        // @todo Replace with API call
        // @todo Optimize by making multiple API calls so that day 1 shows up faster
        const schedule = mock.schedule[classID][moment.utc().startOf("day")];
      }

      // @todo Replace with API call
      const schedule = mock.schedule[classID];

      commit("setter", ["schedule", schedule]);
    }
  }
};
