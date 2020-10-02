/**
 * Initial State applied into vuex module
 * Wrapped in function to prevent shallow copying state modification with object references
 */
export default function initialState() {
  return {
    classes: {},
    partners: {},
    userClasses: [],
    favouriteClassesIDs: [],
    favouritePartnersIDs: [],
    classSchedules: {},
    classReview: {},
    partnerReview: {},
  };
}

// schedule state object
// const schedule = {
//   classes: {
//     ["classID"]: {
//       date1: [time1, time2],
//       date2: [time1, time2],
//     },
//   },
// };

// partners does not have another schedule object.
// when we view partner schedule, we should get all class IDs of the partner
// then we load the individual class schedules
