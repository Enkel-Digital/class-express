/**
 * Handlers for both Vue inner issues and external windows error
 * @reference https://www.raymondcamden.com/2019/05/01/handling-errors-in-vuejs
 *
 * Notes:
 * - When Vue.config.errorHandler is defined, it will not throw an error to window.onerror
 * - However this only applies to errors within vue. So other JS errors are still caught by window.onerror or unhandledrejection window events
 */

import Vue from "vue";

import { ERROR, createError } from "@/constants/error";
import error from "@/store/utils/error";

const newError = (_error) =>
  error.new(createError(ERROR.level.FATAL, ERROR.type.UNDEFINED, _error));

/**
 * @param {object} err The error thrown
 * @param {object} vm Component in which the error is thrown from
 * @param {String} info Vue-specific error info, e.g. which lifecycle hook the error was found in.
 */
Vue.config.errorHandler = async function (err, vueComponent, info) {
  // @todo Remove for production
  console.error("vue.config.errorHandler: ", arguments);

  // Discarding stack as not very useful and hard to send over to server
  // console.error(err.stack);

  // Dispatch without awaitng for store to handle all error logging/reporting logic
  // @todo Create error of type error.type.UNDEFINED here
  newError({
    via: "Vue.config.errorHandler",
    error: err.message,
    info,
  });
};

/**
 * event.promise contains the promise object
 * event.reason contains the reason for the rejection
 */
window.addEventListener("unhandledrejection", function (event) {
  // @todo Remove for production
  console.error("unhandledrejection error event: ", arguments);

  // Dispatch without awaitng for store to handle all error logging/reporting logic
  newError({
    via: "window.addEventListener.unhandledrejection",
    event,
  });
});

window.onerror = function (message, source, lineno, colno, error) {
  // @todo Remove for production
  console.error("window.onerror: ", arguments);

  newError({
    via: "window.onerror",
    error: {
      error: error.message,
      message,
      source,
      lineno,
      colno,
    },
  });
};
