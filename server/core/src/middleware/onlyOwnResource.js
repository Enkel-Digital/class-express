/**
 * Auth middleware to check if the email in JWT matches the userID in URL params
 */

/**
 * Apply this middleware to auth protected routes, and routes that accept userID in the URL params.
 * This middleware enforces that users can only access their own resources
 */
module.exports = async function onlyOwnResource(req, res, next) {
  const { userID } = req.params;

  /**
   * Only if route did not use auth middleware but used this middleware will this fail,
   * else if the auth middleware did not attach these values to use downstream.
   */
  if (!req.authenticatedUser)
    return res.status(500).json({
      success: false,
      error: "Missing authenticated user data from token",
    });

  if (userID !== req.authenticatedUser.email)
    return res.status(403).json({
      success: false,
      error: "Forbidden",
    });
  else return next();
};
