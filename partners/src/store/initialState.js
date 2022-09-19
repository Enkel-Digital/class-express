/**
 * Initial State to be applied into vuex
 * Wrapped in function to prevent shallow copying state modification with object references
 */
export default function initialState() {
  return {
    user: {
      id: undefined,
      partnerID: undefined,
      email: undefined,
      name: undefined,
      // Although user can just set this on the frontend, there is verification on the backend which will not return any data if auth fails
      admin: false,
      permissions: null,
      phoneNumber: null,
      profilePictureURL: null,
    },
  };
}
