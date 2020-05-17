/**
 * Handlers for both Vue inner issues and external windows error
 * @reference https://www.raymondcamden.com/2019/05/01/handling-errors-in-vuejs
 *
 * Notes:
 * - When Vue.config.errorHandler is defined, it will not throw an error to window.onerror
 * - However this only applies to errors within vue. So other JS errors are still caught by window.onerror or unhandledrejection window events
 */

import Vue from "vue";

// Store is used to dispatch errors to the error handler.
import store from "@/store";

/**
 * @param {object} err The error thrown
 * @param {object} vm Component in which the error is thrown from
 * @param {String} info Vue-specific error info, e.g. which lifecycle hook the error was found in.
 */
Vue.config.errorHandler = async function(err, vueComponent, info) {
  // @todo Remove for production
  console.error("vue.config.errorHandler: ", arguments);

  // Discarding stack as not very useful and hard to send over to server
  // console.error(err.stack);

  // Dispatch without awaitng for store to handle all error logging/reporting logic
  // @todo Create error of type error.type.UNDEFINED here
  store.dispatch("error/new", {
    error: err.message,
    info,
    via: "Vue.config.errorHandler"
  });
};

/**
 * event.promise contains the promise object
 * event.reason contains the reason for the rejection
 */
window.addEventListener("unhandledrejection", function(event) {
  // @todo Remove for production
  console.error("unhandledrejection error event: ", arguments);

  // Dispatch without awaitng for store to handle all error logging/reporting logic
  store.dispatch("error/new", {
    event,
    via: "window.addEventListener.unhandledrejection"
  });
});

window.onerror = function(message, source, lineno, colno, error) {
  // @todo Remove for production
  console.error("window.onerror: ", arguments);

  store.dispatch("error/new", { error: error.message, via: "window.onerror" });
};
