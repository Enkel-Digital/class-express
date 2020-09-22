/**
 * Express Router for getting a user's classes, basically all their bookings regardless if it is upcoming or past
 * Mounted on /class
 * @author JJ
 * @module userClasses
 */

const express = require("express");
const router = express.Router();

const SQLdb = require("@enkeldigital/ce-sql");
const auth = require("../../middleware/auth");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:class");

/**
 * Get user's schedule/classes (both past and upcoming classes)
 * @name GET /class/user/:userID
 * @todo Allow query strings to specify the date to filter by?
 * @param {String} [date] unix seconds
 * @returns {object} User class objects
 */
router.get("/user/:userID", auth, express.json(), async (req, res) => {
  try {
    const { userID } = req.params;
    const { date } = req.query; // date === usersTodayTsInTheirTimeZone

    const classes = await SQLdb("userBookingTransactions")
      .where({ userID })
      // startTime will be a string from DB since the DB column type is BigInt
      .select("classID", "points", "startTime")
      // Order by startTime desc, so that the last upcoming class is first.
      // So that if we want to limit the DB results, we will not cut out upcoming classes
      // The later upcoming classes will be cut out if we limit the query and orderBy asc
      // Frontend will need to sort and filter this array somehow to differentiate between upcoming and past classes
      .orderBy("startTime", "desc");
    // @todo limit the query?

    res.status(200).json({ success: true, classes });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
