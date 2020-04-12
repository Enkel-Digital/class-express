/**
 * Express Router for user related routes
 * Mounted on /user
 * @author JJ
 * @module User routes
 */

const express = require("express");
const db = require("../utils/db");
const router = express.Router();

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:users");

/**
 * Get user details object
 * @name GET /user/:userID
 * @function
 * @returns {object} User object
 */
router.get("/:userID", async (req, res) => {
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
    res.json({ success: false, error });
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
