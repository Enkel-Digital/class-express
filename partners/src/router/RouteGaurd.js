// Import AuthType Enum
import AuthType from "./AuthType";
import { auth } from "firebase";

/**
 * @function requiredAuth
 * @param {object} route Vue JS route "to" object
 * @returns {object} bool values of the auth status.
 */
function requiredAuth(route) {
  // Get auth requirements from first route object that matches with route navigated to
  const { Auth_requirements } = route.matched[0].meta;

  return {
    public: Auth_requirements === AuthType.public,
    public_only: Auth_requirements === AuthType.public_only,
    private: Auth_requirements === AuthType.private
  };
}

/**
 * Checks if user's current auth status matches required auth status for the route being accessed
 * @function AuthChecker
 * @returns {null}
 */
function AuthChecker(to, from, next) {
  // Get current user from firebase
  const currentUser = auth().currentUser;

  // Get AuthStatus required for accessing the route.
  const AuthType_required_is = requiredAuth(to);

  /**
   * @notice Call the next middleware provided by vue router with a route to go to.
   * @notice Hard coded routes based on authentication status or proceed to route user requested for.
   */
  // If route is auth protected and user not logged in, redirect to welcome page
  if (AuthType_required_is.private && !currentUser) next({ name: "welcome" });
  // If route is public only and user is logged in, redirect to default private route of home
  else if (AuthType_required_is.public_only && currentUser)
    next({ name: "home" });
  // Else, just continue navigation as per user request.
  else next();
}

export default AuthChecker;
