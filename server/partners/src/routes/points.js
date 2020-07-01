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
const SQLdb = require("@enkeldigital/ce-sql");

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

    // const planID = await SQLdb("userPlans")
    //   .where({
    //     userID,
    //   })
    //   .andWhere(start > now())
    //    .andWhere(end is null or end < now())
    //   .select({ planID })
    //   .first();

    // // -- Find out how much points user starts with this month by looking at the subscriptionPlans
    // const totalPoints = await SQLdb("subscriptionPlans")
    //   .where({ planID })
    //   .select({ totalPoints })
    //   .first();

    res.json({
      success: true,
      /*  points */
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
