/**
 * Handlers for both Vue inner issues and external windows error
 * @reference https://www.raymondcamden.com/2019/05/01/handling-errors-in-vuejs
 *
 * Notes:
 * - When Vue.config.errorHandler is defined, it will not throw an error to window.onerror
 * - However that only applies to errors originating from within vue. So any other JS errors will still be caught
 */

import Vue from "vue";
import api from "@/store/utils/fetch";

/**
 * @param {object} err The error thrown
 * @param {object} vm Component in which the error is thrown from
 * @param {String} info Vue-specific error info, e.g. which lifecycle hook the error was found in.
 */
Vue.config.errorHandler = async function(err, vm, info) {
  // Discarding stack as not very useful and hard to send over to server
  // console.error(err.stack);

  try {
    // @todo store error to vuex?

    // Try reporting error to API if possible
    const resp = await api.post("/error", { error: err.message, info });
    // @todo Remove for production?
    if (resp.success) console.log(resp);
  } catch (error) {
    console.error(error);
  }
};

/**
 * event.promise contains the promise object
 * event.reason contains the reason for the rejection
 */
window.addEventListener("unhandledrejection", function(event) {
  console.error("unhandledrejection error handler: ", arguments);
});

window.onerror = function(message, source, lineno, colno, error) {
  console.error("window.onerror: ", arguments);
};
