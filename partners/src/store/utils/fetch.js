import firebase from "firebase/app";
import "firebase/auth";
import fetch from "fetch-with-fire";
import { apiUrl } from "@/config";

import store from "@/store";
import { ERROR, createError } from "vue-error-controller";

// Return error here to allow the error to be returned to the api caller
function errorHandler(error) {
  // Only log in non production environments
  if (process.env.NODE_ENV !== "production") console.error(error);

  // Assumes that the fetch user will handle the error when success is false.
  // @todo Create the network error here and pass it back
  // @todo I can also send to the store here, then return nothing to ask the caller to ignore?
  return { success: false, error: error.message };
}

export default new fetch(firebase.auth, apiUrl, errorHandler);
