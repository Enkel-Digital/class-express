/**
 * Initial State applied into vuex module
 * Wrapped in function to prevent shallow copying state modification with object references
 */
export default function initialState() {
  return {
    // Points should be an object, but declared undefined first to ensure it is registered to be reactive
    points: undefined,
    topupOptions: [],
  };
}
