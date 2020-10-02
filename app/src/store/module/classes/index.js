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

import { _getClass, getClass, addClass } from "./getClass";
import { _getPartner, getPartner, addPartner } from "./getPartner";

import { getClassSchedule, addClassSchedule } from "./getClassSchedule";
// import getPartnerSchedule from "./getPartnerSchedule";

import unixseconds from "unixseconds";

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    setter,
    toggleFavouriteClass(state, classID) {
      const index = state.favouriteClassesIDs.indexOf(classID);
      /** @notice Toggle state this way to trigger reactive listeners */
      if (index === -1) state.favouriteClassesIDs.unshift(classID);
      else state.favouriteClassesIDs.splice(index, 1);
    },
    toggleFavouritePartner(state, partnerID) {
      const index = state.favouritePartnersIDs.indexOf(partnerID);
      /** @notice Toggle state this way to trigger reactive listeners */
      if (index === -1) state.favouritePartnersIDs.unshift(partnerID);
      else state.favouritePartnersIDs.splice(index, 1);
    },
    // @todo Potentially look into using requestIdle callback or smth to run this in the backend
    setUpcomingClass(state, { classID, selectedTime, points }) {
      const userClasses = state.userClasses;

      for (let i = 0, len = userClasses.length; i < len; i++) {
        const userClass = userClasses[i];

        // Using parseInt for both to ensure that they are not strings, which may be possible as stored as BigInt type
        if (parseInt(selectedTime) > parseInt(userClass.startTime))
          // Returns immediately to end the loop and function
          // Change state using splice to trigger reactive listeners
          return userClasses.splice(i, 0, {
            classID,
            selectedTime,
            points,
          });
      }

      // If the class is somehow older than all classes in the list, append it to the array
      // Append using splice to trigger reactive listeners
      userClasses.splice(userClasses.length - 1, 0, {
        classID,
        selectedTime,
        points,
      });
    },
    // @todo Potentially look into using requestIdle callback or smth to run this in the backend
    deleteUpcomingClass(state, { classID, selectedTime }) {
      const userClasses = state.userClasses;

      for (let i = 0, len = userClasses.length; i < len; i++) {
        const userClass = userClasses[i];

        if (
          userClass.classID === classID &&
          // Using parseInt for both to ensure that they are not strings, which may be possible as stored as BigInt type
          parseInt(userClass.startTime) === parseInt(selectedTime)
        )
          // Returns immediately, as we assume there is only 1 instance of this class and time
          // Change state using Vue methods to trigger reactive listeners
          return Vue.delete(userClasses, i);
      }
    },
    // @todo Support both review objects
    // clearUserReview(state) {
    //   // Clear reviews to prevent caching in memory
    //   Vue.delete(state.review, "userReviews");
    // },
    addClass,
    addPartner,
    addClassSchedule,
    addPartnerSchedule(state, schedule) {
      Vue.set(state.schedule.partner, schedule.partnerID, schedule);
    },
  },
  actions: {
    getClass,
    getPartner,
    // Call getPartner using partnerIDs from Class Objects that are loaded via getClass
    // optional chaining operator to handle cases where classID is undefined to prevent chaining partnerID on undefined
    async getPartnerWithClassIDs({ state, commit }, classID) {
      if (Array.isArray(classID))
        return classID.map(async (id) => {
          const clas = await _getClass(state.classes, commit, id);
          return _getPartner(state.partners, commit, clas?.partnerID);
        });
      else {
        const clas = await _getClass(state.classes, commit, classID);
        return _getPartner(state.partners, commit, clas?.partnerID);
      }
    },
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
        return apiError(
          response,
          () => dispatch("getUsersClasses"),
          "Failed to load your Upcoming and Past classes"
        );

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
    async getFavourites({ commit, dispatch, rootState }) {
      // @todo Now we always call the API, but to udpate by sending the API the last update time
      // Else just ignore if favourites is already cached as user cant update favourites from another device anyways
      const response = await apiWithLoader.get(
        `/favourites/${rootState.user.id}`
      );

      if (!response.success)
        return apiError(
          response,
          () => dispatch("getFavourites"),
          "Failed to load your favourite classes and partners"
        );

      commit("setter", ["favouriteClassesIDs", response.favourites.classes]);
      dispatch("getClass", response.favourites.classes);

      commit("setter", ["favouritePartnersIDs", response.favourites.partners]);
      dispatch("getPartner", response.favourites.partners);
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
        // Favourite is either false, or an object stating when it has been favourited
        favourite:
          state.favouriteClassesIDs.indexOf(classID) === -1
            ? false
            : { favouritedAt: unixseconds() },
      });

      // On error change back favourite value first using the toggle mutation
      if (!response.success) {
        commit("toggleFavouriteClass", classID);
        return apiError(
          response,
          () => dispatch("toggleFavouriteClass"),
          "Failed to save update to favourite classes"
        );
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
        // Favourite is either false, or an object stating when it has been favourited
        favourite:
          state.favouritePartnersIDs.indexOf(partnerID) === -1
            ? false
            : { favouritedAt: unixseconds() },
      });

      // On error change back favourite value first using the toggle mutation
      if (!response.success) {
        commit("toggleFavouritePartner", partnerID);
        return apiError(
          response,
          () => dispatch("toggleFavouritePartner"),
          "Failed to save update to favourite partners"
        );
      }
    },
    // Get Schedules of a given class and date
    getClassSchedule,
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
    async reserveClass(
      { state, rootState, commit, dispatch },
      { classID, selectedTime }
    ) {
      const { points: classPoints } = state.classes[classID];
      const userPoints = rootState.points.points;

      // Check if user have enough points for the class
      if (userPoints.left < classPoints) {
        // redirect to topup view
        if (confirm("Not enough points, topup?"))
          router.push({ name: "topup" });
      } else if (confirm(`Reserve class for ${classPoints} points?`)) {
        // Add API call to set upcoming class
        const response = await apiWithLoader.post("/class/reserve", {
          userID: rootState.user.id,
          classID,
          selectedTime,
        });

        if (!response.success)
          return apiError(
            response,
            () => dispatch("reserveClass", { classID, selectedTime }),
            "Failed to reserve class"
          );

        // Pessimistic UI, commit changes after API call is successful
        // commit("setUpcomingClass", { classID, selectedTime, classPoints });
        // @todo Temporarily using this action instead of calculating the new userClasses array ourselves on the client
        dispatch("getUsersClasses");

        // Call mutation method from points vuex module to deduct points
        // Alternatively, we can dispatch an action in points module to get user points again
        commit("points/deductPoints", classPoints, { root: true });
      }
    },
    async cancelClass(
      { state, rootState, commit, dispatch },
      { classID, selectedTime }
    ) {
      const { points: classPoints } = state.classes[classID];

      // @todo User obviously cannot cancel when the class is in progress or after it ended
      // @todo Add time check to ensure user knows that we will charge him extra if cancelling late

      if (!confirm("Cancel your reservation?")) return;

      // Add API call to set upcoming class
      const response = await apiWithLoader.post("/class/cancel", {
        userID: rootState.user.id,
        classID,
        selectedTime,
      });

      if (!response.success)
        return apiError(response, () =>
          dispatch(
            "cancelClass",
            { classID, selectedTime },
            "Failed to cancel class reservation"
          )
        );

      // Pessimistic UI, commit changes after API call is successful
      // commit("deleteUpcomingClass", { classID, selectedTime });
      // @todo Temporarily using this action instead of calculating the new userClasses array ourselves on the client
      dispatch("getUsersClasses");

      // Call mutation method from points vuex module to refund back the points
      // Alternatively, we can dispatch an action in points module to get user points again
      commit("points/refundPoints", classPoints, { root: true });
    },
    // @todo Update to get only the basic review data instead of using the whole reviews object
    // API should return result without userReview
    // Generic review loading action, for both Class and Partner reviews.
    async getReview({ state, commit, dispatch }, { classID, partnerID }) {
      const id = classID || partnerID;
      const typeString = classID ? "class" : "partner";
      const stateKey = `${typeString}Review`;

      // If there is a review in state, and it is for this ID and type, ignore the request
      if (state[stateKey] && id === state[stateKey].id) return;

      const response = await apiWithLoader.get(`/reviews/${typeString}/${id}`);
      if (!response.success)
        return apiError(
          response,
          () => dispatch("getReview"),
          `Failed to load reviews for: ${typeString} - ${id}`
        );

      // Set the reviews object along with the id in state. ID used for caching and prevent duplicated calls to API
      commit("setter", [stateKey, { id, ...response.reviews }]);
    },
    // @todo Update to get userReviews instead of using the current reviews API
    async getUserReview({ state, commit, dispatch }, { classID, partnerID }) {
      const id = classID || partnerID;
      const typeString = classID ? "class" : "partner";
      const stateKey = `${typeString}Review`;

      // If there is a review in state, and it is for this ID and type, ignore the request
      if (state[stateKey] && id === state[stateKey].id) return;

      const response = await apiWithLoader.get(`/reviews/${typeString}/${id}`);
      if (!response.success)
        return apiError(
          response,
          () => dispatch("getReview"),
          `Failed to load reviews for: ${typeString} - ${id}`
        );

      // Set the reviews object along with the id in state. ID used for caching and prevent duplicated calls to API
      commit("setter", [stateKey, { id, ...response.reviews }]);
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
