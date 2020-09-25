/**
 * Module to get schedule of a class and populating vuex state after getting data back from API
 *
 * @note This only loads the day that is requested, so like if you request for me to load today, I will not actively load tmr to reduce reads from DB
 *
 * @todo Technically this module should be a fetchClassSchedule then a get, since for get we expect the function to return smth, whereas fetch
 * makes it clear that this only fetches and caches the fetched data to state.
 */

import Vue from "vue";
import moment from "moment";
import api from "@/store/utils/fetch";
import apiError from "@/store/utils/apiError";
// import apiWithLoader from "@/store/utils/apiWithLoader";

/**
 * The purpose of the current schedulesToFetch "Queue" is just to ensure that if getClassSchedule is called repeatedly
 * with the same classID before the first call resolves, it would not make 2 calls to the API and instead ignore
 * the getClassSchedule request from the second time onwards.
 *
 * This is a internal in memory Queue instead of being in the state for better performance
 */
const schedulesToFetch = {};

/**
 * Inner function to request for a class's schedule with "classID" from server if not available locally.
 * Will commit the schedule into vuex state once server responds for components to use via reactive computed properties.
 * Alternatively caller can also await this to get back the schedule array directly
 *
 * @param {object} schedule Class Schedule object on vuex state passed in from the action
 * @param {Function} commit Vuex commit function of classes module passed in from the action
 * @param {Number} classID Class ID for the class to get the schedule of.
 * @param {Number} [date=moment().startOf("day").unix()] Defaults to unix seconds of the start of today in local timezone
 * @return {Array<String>} Array of ISO 8061 time strings
 */
async function _getClassSchedule(
  schedule,
  commit,
  classID,
  date = moment().startOf("day").unix()
) {
  if (!classID) return; // End if classID is undefined

  // If schedule object for class not available, create an empty schedule object
  if (schedule[classID]) {
    // Skip and return schedule object for the classID and given date if it is already downloaded and cached locally
    // Will skip even if it is an empty array for that date, meaning no schedule for that day
    if (schedule[classID][date]) return schedule[classID][date];
  }
  // Using commit to mutate state to place an empty object on it instead of direct assignment,
  // As the mutation method uses Vue.set which will allow for reactive property watching.
  // If set directly instead of using Vue.set, the computed properties of component wont be able to detect the change
  else commit("addClassSchedule", { classID });

  // Skip if schedule of classID is already requested for but not fulfilled yet
  if (schedulesToFetch[classID]) {
    if (schedulesToFetch[classID][date]) return;
  } else schedulesToFetch[classID] = {};

  // Set classID into "Queue" to prevent getClassSchedule from being called again with same ID before this class is fetched
  schedulesToFetch[classID][date] = true;

  // Date value defaults to empty string in case it is undefined, which will be interpolated to "undefined"
  const response = await api.get(`/schedule/class/${classID}/${date || ""}`);

  // Clear from queue immediately after API resolves to prevent this from being uncleared if retries if API failed
  delete schedulesToFetch[classID][date];

  // @todo See if this.call(this) is actually valid
  if (!response.success)
    return apiError(
      response,
      () => this.call(this),
      "Unable to get class schedule"
    );

  // Save schedule to state
  commit("addClassSchedule", {
    classID,
    date,
    schedule: response.schedule,
  });

  // Return schedule to allow caller to get schedule back if they would like to await for the result instead of relying on mapState
  return response.schedule;
}

/**
 * Function to request for class(es) with "classID(s)" to fetch from server if not available locally.
 * Will populate the class into state once server responds.
 * Returns the requested classObject if value does not exist in state and not previously requested for.
 * However do not rely on the return value as if it is already in state or previously requested for it will return undefined
 * @param {(object|object[])} schedule A schedule or an array of schedule objects with "classID" and a "dateCursor" in them
 * @returns {(undefined | Promise<Array> | Array<Promise<Array>>)} A promise or an array of promise that resolves to class schedule arrays
 */
async function getClassSchedule({ state, commit }, schedule) {
  if (Array.isArray(schedule))
    return schedule.map((scheduleObject) =>
      _getClassSchedule(
        state.classSchedules,
        commit,
        scheduleObject.classID,
        scheduleObject.dateCursor
      )
    );
  else
    return _getClassSchedule(
      state.classSchedules,
      commit,
      schedule.classID,
      schedule.dateCursor
    );
}

function addClassSchedule(state, schedule) {
  // If the class did not already exist, create an empty object with classID as the key
  if (!state.classSchedules[schedule.classID])
    Vue.set(state.classSchedules, schedule.classID, {});

  Vue.set(
    state.classSchedules[schedule.classID],
    schedule.date, // Use the date timestamp as the key of the schedule object, where date is a unix timestamp of the current timezone....?
    schedule.schedule
  );
}

export { getClassSchedule, addClassSchedule };
