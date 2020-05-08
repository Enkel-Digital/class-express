/**
 * Auth middleware to check if the email in JWT matches the userID in URL params
 */

/**
 * Apply this middleware to auth protected routes, and routes that accept userID in the URL params.
 * This middleware enforces that users can only access their own resources
 */
module.exports = async function onlyOwnResource(req, res, next) {
  const { userID } = req.params;

  if (userID !== req.authenticatedUser.email) {
    return res.status(403).json({
      success: false,
      error: "Forbidden"
    });
  } else return next();
};
