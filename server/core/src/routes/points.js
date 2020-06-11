/**
 * Mounted on /points
 * @author JJ
 * @module points routes
 *
 * This router is mounted on a auth protected route,
 * thus individual auth verifier middleware not needed
 */

const express = require("express");
const router = express.Router();
const db = require("../utils/db");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:points");

/**
 * Get a user's points, if new user, create default points object and save it
 * @name GET /points/:userID
 * @function
 * @returns {object} User's points object
 */
router.get("/:userID", async (req, res) => {
  try {
    const { userID } = req.params;

    let points = (await db.collection("points").doc(userID).get()).data();

    // If no points doc, means first time using app
    if (!points) {
      // Get timezone of the user from userDB, else defaults to "SGT" for now
      const { timezone = "SGT" } = (
        await db.collection("users").doc(userID).get()
      ).data();

      // Default points object for new user
      const defaultPointsObject = {
        // Default points to 0 rather than null to show on screen
        left: 0,
        total: 0,
        period: {
          /**
           * "timezone" is duplicated in points doc.
           * But not really duplicated since user can change their original timezone,
           * but we still want to charge them at the same time every points period
           */
          timezone,
          start: null,
          end: null,
        },
      };

      // Create document in points with user's email and default points object
      // Not awaiting for set to complete before replying user.
      // @todo Might cause an issue if this fails
      db.collection("points").doc(userID).set(defaultPointsObject);

      // Set user's points to the default points object that was just set to DB
      points = defaultPointsObject;
    }

    res.json({ success: true, points });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
