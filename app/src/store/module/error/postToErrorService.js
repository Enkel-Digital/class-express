/**
 * Simple post method using fetch API to send error objects to the error tracking service.
 * Not using default fetch utils module to support custom error handling to
 * prevent cascading failures, when the error API itself is down.
 *
 * @author JJ
 */

import firebase from "firebase/app";
import "firebase/auth";
import fetch from "fetch-with-fire";

import { errorApiEndpoint } from "@/config"; // Put this into config

// Return error here to allow the error to be handled by the error/new action.
// Make the error handler return a reponse object that is similiar to normal failed request objects.
function errorHandler(error) {
  // Only log in non production environments
  if (process.env.NODE_ENV !== "production") console.error(error);
  return { success: false, error: error.message };
}

const api = new fetch(firebase.auth, errorApiEndpoint, errorHandler);

/**
 * @function postToErrorService
 */
export default (error) => api.post("/", error);
