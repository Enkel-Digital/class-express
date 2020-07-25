/**
 * Express Router for user related routes
 * Mounted on /user
 * @author JJ
 * @module User routes
 *
 * This router is mounted on a auth protected route,
 * thus individual auth verifier middleware not needed
 */

const express = require("express");
const router = express.Router();
const SQLdb = require("@enkeldigital/ce-sql");
const onlyOwnResource = require("../middleware/onlyOwnResource");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:users");

/**
 * Get user details object
 * @name GET /user/:userEmail
 * @returns {object} User object
 */
router.get("/:userEmail", onlyOwnResource, async (req, res) => {
  try {
    const { userEmail } = req.params;

    const user = await SQLdb("userAccounts")
      .where({ email: userEmail })
      .first();
    // .select("partnerID", "name", "admin"); // @todo Add filter for properties

    if (user) res.json({ success: true, user });
    else res.status(404).json({ success: false, error: "No such user" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Create new user details object
 * @name POST /user/new/
 * @param {String} userID
 * @param {Object} user
 * @returns {object} success indicator
 *
 * @todo Should support like a hook system.
 * All the things that should be ran when a new user is created should be posted here as a hook
 * then on user creation, either call all the hooks, or publish a event for all the listeners to use.
 */
router.post("/new", express.json(), async (req, res) => {
  try {
    // Refer to notes for why we are enforcing this lowercase usage.
    req.body.user.email = req.body.user.email.toLowerCase();
    const user = req.body.user;

    await SQLdb("userAccounts").insert(user);

    res.status(201).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Update user details object
 * @name PUT /user/:userID
 * @returns {object} success indicator
 */
router.put("/", (req, res) => {
  res.json({ success: false, error: "not implemented yet" });
});

/**
 * Delete user account
 * @name DELETE /user/:userID
 * @function
 * @param {object} user
 * @returns {object} Success indicator
 */
router.delete("/:userID", express.json(), async (req, res) => {
  try {
    const { userID } = req.params;

    await SQLdb("userAccounts").where({ id: userID }).update({ deleted: true });

    res.json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
