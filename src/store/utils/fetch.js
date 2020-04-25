/**
 * Module that extends the browser fetch method to auto prepend API URL
 */

import { auth } from "firebase";
import { apiUrl } from "@/config.js";

async function fetch(url = "", init = {}) {
  try {
    // Call window fetch with prepended API URL and default request object
    const response = await window.fetch(
      apiUrl + url,
      Object.assign(
        {
          headers: {
            Authorization: `Bearer ${await auth().currentUser.getIdToken()}`
          }
        },
        init
      )
    );

    const parsedResponse = response.json();

    if (parsedResponse.status === false) throw new Error(parsedResponse.error);

    return parsedResponse;
  } catch (error) {
    // Only allow this in debug mode
    console.error(error);

    return error;
  }
}

export default fetch;
