/**
 * Simple post method using fetch API to send error objects to the error tracking service.
 * Not using default fetch utils module to support custom error handling to
 * prevent cascading failures, when the error API itself is down.
 *
 * @author JJ
 */

import { auth } from "firebase";
import { apiUrl } from "@/config";

// @todo Migrate to a seperate error tracking service to prevent API service failure causing cascading failures
const errorApiURL = apiUrl + "/error";

/**
 * Only returns authentication header if user is authenticated.
 * Split out so if user is unauthenticated, this does not throw if currenUser is null
 * @function getAuthHeader
 * @returns {String} Authentication header or nothing.
 */
async function getAuthHeader() {
  if (auth().currentUser)
    return `Bearer ${await auth().currentUser.getIdToken()}`;
}

/**
 * @function postToErrorService
 * @param {object} error Custom error object that can be stringified
 */
async function postToErrorService(error = {}) {
  try {
    // Call window fetch with error API URL and default request object
    const response = await window.fetch(errorApiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Send auth token if available.
        // Error tracking service should not reject no-auth-token calls
        Authorization: await getAuthHeader()
      },
      body: JSON.stringify(error)
    });

    // @todo Add a check as not all should be parsed/treated as json
    const parsedResponse = response.json();

    if (parsedResponse.status === false) throw new Error(parsedResponse.error);

    return parsedResponse;
  } catch (error) {
    return error;
  }
}

export default postToErrorService;
