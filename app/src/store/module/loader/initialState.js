/**
 * Initial State applied into vuex module
 * Wrapped in function to prevent shallow copying state modification with object references
 */
export default function initialState() {
  return {
    loaderRequests: {},
  };
}

/**
 * Example/Reference on how loaderRequest object would look like
 */
const loaderRequestReference = {
  fullScreen: true, // Bool value to determine what type of loader to show
};
