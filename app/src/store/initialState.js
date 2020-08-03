/**
 * Initial State to be applied into vuex
 * Wrapped in function to prevent shallow copying state modification with object references
 */
export default function initialState() {
  return {
    user: {
      id: undefined,
      email: undefined,
      name: undefined,
      firstName: undefined,
      lastName: undefined,
      imageSrc: undefined,
    },
  };
}
