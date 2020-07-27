import api from "./fetch";
import Vue from "vue";

/**
 * Function that sandwiches the api call between the loader set and clear calls.
 * Uses generic application and rest parameters to make the actual call.
 *
 * @notice
 * Uses ES6 Rest parameters
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
 */
async function withLoader(fn, ...fnArgs) {
  // Show loader before API call and get loaderID back
  const loaderID = await Vue.$loader.new();

  // Call the api using generic application here
  const response = await fn(...fnArgs);

  // Remove loader after API responds
  Vue.$loader.clear(loaderID);

  return response;
}

/**
 * Simple wrapper over api from fetch to execute it sandwiched in a loader set and loader clear call
 */
export default {
  async get(url) {
    return withLoader(api.get, url);
  },
  async post(url, data) {
    return withLoader(api.post, url, data);
  },
  async patch(url, data) {
    return withLoader(api.post, url, data);
  },
  async put(url, data) {
    return withLoader(api.post, url, data);
  },
  async delete(url, data) {
    return withLoader(api.post, url, data);
  },
};
