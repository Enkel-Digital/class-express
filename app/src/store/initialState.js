/**
 * Initial State to be applied into vuex
 * Wrapped in function to prevent shallow copying state modification with object references
 */
export default function initialState() {
  return {
    user: {
      name: undefined,
      fname: undefined,
      lname: undefined,
      fullName: undefined,

      email: undefined
    },
    points: {
      left: undefined,
      total: undefined,
      pointsPeriod: {
        timezone: undefined,
        start: undefined,
        end: undefined
      }
    },
    settings: {
      notifications: {
        mobileNotification: true,
        emailNotification: true
      }
    }
  };
}