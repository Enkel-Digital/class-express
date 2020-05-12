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
const db = require("../utils/db");
const onlyOwnResource = require("../middleware/onlyOwnResource");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:users");

/**
 * Get user details object
 * @name GET /user/:userID
 * @function
 * @returns {object} User object
 */
router.get("/:userID", onlyOwnResource, async (req, res) => {
  try {
    const { userID } = req.params;

    const userDoc = await db
      .collection("users")
      .doc(userID)
      .get();

    const user = userDoc.data();
    if (!user) throw new Error("User does not exist");

    res.json({ success: true, user });
  } catch (error) {
    logger.error(error);
    res.status(error.code ? error.code : 500).json({ success: false, error: error.message });
  }
});

/**
 * Create new user details object
 * @name POST /user/new/
 * @function
 * @param {String} userID
 * @param {Object} user
 * @returns {object} success indicator
 */
router.post("/new", express.json(), async (req, res) => {
  try {
    // Ensure that the email used as userID is lowercase.
    // Refer to notes for why we are enforcing this lowercase usage.
    const userID = req.body.userID.toLowerCase();
    req.body.user.email = req.body.user.email.toLowerCase();
    const user = req.body.user;

    // Create document in user with user's email as userID
    await db
      .collection("users")
      .doc(userID)
      .set(user);

    res.status(201).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Update user details object
 * @name PUT /user/:userID
 * @function
 * @returns {object} success indicator
 */
router.get("/", (req, res) => {
  res.json({ success: true });
});

module.exports = router;
