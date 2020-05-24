/**
 * Initial State applied into vuex module
 * Wrapped in function to prevent shallow copying state modification with object references
 */
export default function initialState() {
  return {
    errors: {},
  };
}

/**
 * Example/Reference on how an error object element would be
 */
const errorElementReference = {
  type: "enum of error types",
};
