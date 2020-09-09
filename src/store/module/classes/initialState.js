/**
 * Initial State applied into vuex module
 * Wrapped in function to prevent shallow copying state modification with object references
 */
export default function initialState() {
  return {
    classes: {},
    partners: {},
    userClasses: [],
    favouriteClasses: {},
    favouritePartners: {},
    schedule: {
      class: {},
      partner: {},
    },
    review: {},
  };
}
