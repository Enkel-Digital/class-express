/**
 * Module that extends the browser fetch method to auto prepend API URL
 * API module that wraps around the API server and fetch module
 */

import { auth } from "firebase";
import { apiUrl } from "@/config";

/**
 * Inner fetch function used to prepend API base URL and parse the response
 * @function _fetch
 * @param {String} url path of the API only, the base API will be prepended
 * @param {object} init Request object required by fetch
 */
async function _fetch(url = "", init) {
  try {
    // Call window fetch with prepended API URL and default request object
    const response = await window.fetch(apiUrl + url, init);

    // @todo Add a check as not all should be parsed/treated as json
    const parsedResponse = response.json();

    if (parsedResponse.status === false) throw new Error(parsedResponse.error);

    return parsedResponse;
  } catch (error) {
    // Only allow this in debug mode
    console.error(error);

    return error;
  }
}

/**
 * GET curried function that takes a init object before an URL
 */
function _get(init = {}) {
  return async function(url) {
    return _fetch(
      url,
      Object.assign(
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${await auth().currentUser.getIdToken()}`
          }
        },
        init
      )
    );
  };
}

/**
 * POST curried function that takes a init object before an URL and data
 */
function _post(init = {}) {
  return async function(url, data) {
    if (data) init.body = JSON.stringify(data);

    return _fetch(
      url,
      Object.assign(
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await auth().currentUser.getIdToken()}`
          }
        },
        init
      )
    );
  };
}

/**
 * Function to modify the init object only once before making a new request
 * @param {object} init Request object for fetch
 * @returns {object} Same API object with custom request object partially applied.
 */
function modify(init = {}) {
  // Return the http methods to chain it and make a request
  return {
    get: _get(init),
    post: _post(init)
  };
}

/**
 * singleton object for interacting with API server
 *
 * API:
 * api.get(url)
 * api.modify(custom request object).get(url)
 * api.post(url, data)
 * api.modify(custom request object).post(url, data)
 *
 * @notice GET/POST methods are basically _get/_post with no init objects applied
 */
export default {
  get: _get(),
  post: _post(),
  modify
};
