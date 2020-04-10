/**
 * Initial State applied into vuex module
 * Wrapped in function to prevent shallow copying state modification with object references
 */
export default function initialState() {
  return {
    settings: {
      modifiedAt: undefined, // Timestamp of when setting was last modified.
      notifications: {
        mobileNotification: true,
        emailNotification: true
      }
    }
  };
}
