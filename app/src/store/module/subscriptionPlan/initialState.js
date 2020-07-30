/**
 * Initial State applied into vuex module
 * Wrapped in function to prevent shallow copying state modification with object references
 */
export default function initialState() {
  return {
    status: undefined,
    current: undefined,
    next: undefined,
    subscriptionPlans: [],
  };
}
