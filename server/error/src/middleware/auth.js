/**
 * Auth middleware
 * Using "Firebase Auth" for authentication
 */

const admin = require("firebase-admin");

/**
 * Apply this middleware to auth protected routes.
 * This middleware allows all users' requests with valid firebase auth tokens through.
 * Thus business logics need to handle extra conditions locally. E.g. user can only request for their own data.
 *
 * @todo Only allow requests if made from the App's authorised domain to prevent token misuse
 *  - also will the url tracking work if user use a vpn?
 *  - Does a vpn changethe origin request URL?
 */
module.exports = async function auth(req, res, next) {
  try {
    // Get auth token if available and if it follows the "bearer" pattern
    // @notice Headers are all lowercased by express
    // https://firebase.google.com/docs/auth/admin/verify-id-tokens#verify_id_tokens_using_the_firebase_admin_sdk
    // The verifyIdToken needs a project ID, but should be taken care of if firebase admin has been initialised properly or runs on gcp infra
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      const authToken = req.headers.authorization.split(" ")[1];

      const userInfo = await admin.auth().verifyIdToken(authToken);

      // Attach to req for use downstream
      // Store only custom claims if any, and other useful properties
      req.authenticatedUser = { uid: userInfo.uid, email: userInfo.email };

      return next();
    } else throw new Error("Missing auth token");
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: error.message || "UNAUTHORIZED",
    });
  }
};
