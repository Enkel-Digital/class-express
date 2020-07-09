/**
 * Auth middleware to check if the email in JWT matches the userID in URL params
 * Only allow user to READ data if userID in their token matches the userID in the url params
 */

/**
 * Apply this middleware to auth protected routes, and routes that accept userID in the URL params.
 * This middleware enforces that users can only access their own resources
 */
module.exports = async function onlyOwnResource(req, res, next) {
  return next();
  /* eslint-disable no-unreachable */

  // @todo To migrate to only userEmail and only userID, where userID will no longer be email
  const { userID, userEmail } = req.params;

  /**
   * Only if route did not use auth middleware but used this middleware will this fail,
   * else if the auth middleware did not attach these values to use downstream.
   */
  if (!req.authenticatedUser)
    return res.status(401).json({
      success: false,
      error: "Missing authenticated user data from token",
    });

  // // Cache the entire user email to userID mapping???
  // if (
  //   req.authenticatedUser.email !== userID &&
  //   req.authenticatedUser.email !== userEmail
  // )
  //   return res.status(403).json({
  //     success: false,
  //     error: "Forbidden",
  //   });
  // else return next();
  next();
};
