// @todo After migration to eazyfetch, might want to convert this into a plugin instead
import fetch from "./fetch";
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
 * Wrapping in a function instead of a simple defualt export as there are cases where a API service with a different base URL
 * needs to be used instead of the default fetch/api service. E.g. using this with the billing service endpoint API service
 * @param api API service to wrap around.
 */
export function createApiWithLoader(api) {
  return new Proxy(
    {}, // Empty target as we just want to use the GET traps
    {
      // Target is intentionally unused, because using proxy only for the GET traps
      get(target, prop) {
        switch (prop) {
          case "get":
          case "delete":
            return (url) => withLoader(api[prop], url);

          case "post":
          case "patch":
          case "put":
            return (url, data) => withLoader(api[prop], url, data);

          default:
            throw new Error(`Invalid HTTP method '${prop}' for apiWithLoader`);
        }
      },
    }
  );
}

// Use the default export using the default fetch (with default base API URL)
export default createApiWithLoader(fetch);
