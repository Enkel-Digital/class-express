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

import unixseconds from "unixseconds";

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    setter,
    toggleFavouriteClass(state, classID) {
      /** @notice Toggle state using Vue methods to trigger reactive listeners */
      if (state.favouriteClasses[classID])
        Vue.delete(state.favouriteClasses, classID);
      else
        Vue.set(state.favouriteClasses, classID, {
          favouritedAt: unixseconds(),
        });
    },
    toggleFavouritePartner(state, partnerID) {
      /** @notice Toggle state using Vue methods to trigger reactive listeners */
      if (state.favouritePartners[partnerID])
        Vue.delete(state.favouritePartners, partnerID);
      else
        Vue.set(state.favouritePartners, partnerID, {
          favouritedAt: unixseconds(),
        });
    },
    setUpcomingClass(state, { classID, action, timestamp }) {
      /** @notice Change state using Vue methods to trigger reactive listeners */
      // @todo Change set and delete to use the specific timestamp of that class
      if (action) Vue.set(state.upcomingClasses, classID, true);
      else Vue.delete(state.upcomingClasses, classID);
    },
    clearUserReview(state) {
      // Clear reviews to prevent caching in memory
      Vue.delete(state.review, "userReviews");
    },
    addClass,
    addPartner,
    addClassSchedule,
    addPartnerSchedule(state, schedule) {
      Vue.set(state.schedule.partner, schedule.partnerID, schedule);
    },
  },
  getters: {
    // @todo Change this to be like class details and upcoming class, use the view template to map classID to class object
    favouriteClasses(state) {
      return Object.keys(state.favouriteClasses)
        .sort(
          (a, b) =>
            state.favouriteClasses[b].favouritedAt -
            state.favouriteClasses[a].favouritedAt
        ) // Sort by decsending order
        .map((classID) => state.classes[classID]) // Convert from classID to class object
        .filter((clas) => clas); // Filter to remove undefined if any class is not loaded into state yet
    },
    favouritePartners(state) {
      return Object.keys(state.favouritePartners)
        .sort(
          (a, b) =>
            state.favouritePartners[b].favouritedAt -
            state.favouritePartners[a].favouritedAt
        ) // Sort by decsending order
        .map((partnerID) => state.partners[partnerID]) // Convert from partnerID to partner object
        .filter((partner) => partner); // Filter to remove undefined if any partner is not loaded into state yet
    },
  },
  actions: {
    getClass,
    getPartner,
    /**
     * Get list of user's classes from API
     * This includes both upcoming and past classes
     * @function getUsersClasses
     */
    async getUsersClasses({ rootState, dispatch, commit }) {
      const response = await apiWithLoader.get(
        `/class/user/${rootState.user.id}`
      );

      if (!response.success)
        return apiError(response, () => dispatch("getUsersClasses"));

      dispatch(
        "getClass",
        response.classes.map((clas) => clas.classID)
      );

      // when I call api for upcoming, give upcoming at READ TIME
      // However store it in userClasses, then differentiate them to be either upcoming or past classes depending on the current time of display
      // If I call past classes, API gets past classes filtering by READ TIME, then store in past classes
      // past classes might not be accurate too, as a upcomingClass can become a past class while using the app,
      commit("setter", ["userClasses", response.classes]);
    },
    /**
     * Call API for BOTH favourite classes and partners
     * Both tied together as thats how the DB data is structured and how the API works
     * @function getFavourites
     */
    async getFavourites({ state, commit, dispatch, rootState }) {
      // @todo Now we always call the API, but to udpate by sending the API the last update time
      // Else just ignore if favourites is already cached as user cant update favourites from another device anyways
      const response = await apiWithLoader.get(
        `/favourites/${rootState.user.id}`
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
        userID: rootState.user.id,
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
        userID: rootState.user.id,
        partnerID,
        favourite: state.favouritePartners[partnerID], // The value in state after the toggle
      });

      // On error change back favourite value first using the toggle mutation
      if (!response.success) {
        commit("toggleFavouritePartner", partnerID);
        return apiError(response, () => dispatch("toggleFavouritePartner"));
      }
    },
    /**
     * Get Schedules of a given class and date
     * @function getClassSchedule
     * @param {number} [dateCursor=today] unix timestamp of the start of the day in utc.
     * @todo Wait what,  why start of the day in utc?... er.... i confused
     */
    async getClassSchedule(
      { state, dispatch, commit },
      { classID, dateCursor = "" }
    ) {
      // return getClassSchedule({ state, commit }, { classID, date: dateCursor });

      /*  schedule state object
      const schedule = {
        classes: {
          ["classID"]: {
            date1: [
              time1,
              time2,
            ],
            date2: [
              time1,
              time2,
            ],
          },
        },
        
        partners should not have another schedule object.
        when we view partner schedule, we should just get all class IDs of the partner
        then we load the individual class schedules
      };
      */

      // eslint-disable-next-line no-unreachable
      const today = () => moment().startOf("day");

      /*
        console.log(
          "te agn",
          today().add(1, "hours").unix(),
          moment(today().add(1, "hours").unix())
        );
        
        above console logs shows the issues
        moment().unix() returns UNIX time in seconds
        whereas, Date.now() returns unix time in milliseconds,
        and moment(UNIX TIME) expects MILISECONDS as the input param
        
        SO SOLUTIONS
        always keep everything in seconds, NO MILISECONDS.
        to get seconds:
        - unixseconds()
        - moment().unix()
        
        To get moment object from unix seconds
        - moment.unix(unix seconds)
        
        Also note that <https://momentjs.com/docs/#/parsing/unix-timestamp/> shows that moment.unix(seconds) returns
        a moment object of local time, so you need to chain a .utc() if you want utc time.
        
        
        Note:
        Sometimes whats passed in is a string and not a int,
        so before creating the object, might be wise to do a parseInt before that
      */

      commit("addClassSchedule", {
        classID: 1,
        date: today().unix(),
        schedule: [
          today().add(1, "hours").unix(),
          today().add(2, "hours").unix(),
          today().add(3, "hours").unix(),
          today().add(7, "hours").unix(),
          today().add(10, "hours").unix(),
          today().add(15, "hours").unix(),
        ],
      });

      commit("addClassSchedule", {
        classID: 1,
        date: today().add(1, "days").unix(),
        schedule: [
          today().add(1, "days").add(1, "hours").unix(),
          today().add(1, "days").add(2, "hours").unix(),
          today().add(1, "days").add(10, "hours").unix(),
        ],
      });
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
