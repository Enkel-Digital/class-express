/**
 * Module that extends the browser fetch method to auto prepend API URL
 */

import { apiUrl } from "@/config.js";

async function fetch(url = "", init = {}) {
  try {
    const response = await window.fetch(apiUrl + url, init);

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
