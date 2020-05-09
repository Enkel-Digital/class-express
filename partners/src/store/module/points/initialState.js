/**
 * Initial State applied into vuex module
 * Wrapped in function to prevent shallow copying state modification with object references
 */
export default function initialState() {
  return {
    points: {
      left: 0,
      total: 0,
      period: {
        timezone: undefined,
        start: undefined,
        end: undefined,
      },
    },
    topupOptions: [],
  };
}
