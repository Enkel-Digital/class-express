/**
 * Initial State to be applied into vuex
 * Wrapped in function to prevent shallow copying state modification with object references
 */
export default function initialState() {
  return {
    user: {
      email: undefined,
      name: undefined,
      fname: undefined,
      lname: undefined,
      fullName: undefined
    },
    points: {
      left: undefined,
      total: undefined,
      period: {
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
