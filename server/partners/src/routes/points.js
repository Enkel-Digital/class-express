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
const unixseconds = require("unixseconds");
const SQLdb = require("@enkeldigital/ce-sql");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:points");

/**
 * Get pending points of partner where user booked class, but class have yet to end
 * @name GET /points/pending/:partnerID
 * @returns {object} Points
 */
router.get("/pending/:partnerID", async (req, res) => {
  try {
    const { partnerID } = req.params;

    const nowTS = unixseconds();

    const { points } = await SQLdb("userBookingTransactions")
      .join("classes", "userBookingTransactions.classID", "=", "classes.id")
      .where({ "classes.partnerID": partnerID })
      // @todo Change time to end of class rather than start of class after schema is updated
      .andWhere("userBookingTransactions.startTime", ">", nowTS) // If the start time is after nowTS
      .sum("userBookingTransactions.points as points")
      .first();

    res.json({
      success: true,
      points: points || 0,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get points of partner where class has ended
 * @name GET /points/valid/:partnerID
 * @returns {object} Points
 */
router.get("/valid/:partnerID", async (req, res) => {
  try {
    const { partnerID } = req.params;

    const nowTS = unixseconds();

    const { points } = await SQLdb("userBookingTransactions")
      .join("classes", "userBookingTransactions.classID", "=", "classes.id")
      .where({ "classes.partnerID": partnerID })
      // @todo Change time to end of class rather than start of class after schema is updated
      .andWhere("userBookingTransactions.startTime", "<=", nowTS) // If the start time is before nowTS
      .sum("userBookingTransactions.points as points")
      .first();

    const { pointsWithdrawn } = await SQLdb("partnerPayouts")
      .where({ partnerID })
      // @todo Add check to sync with points.
      .sum("points as points")
      .first();

    res.json({
      success: true,
      points: points - pointsWithdrawn || 0,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
