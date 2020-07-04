/**
 * Express Router for getting a user's classes, basically all their bookings regardless if it is upcoming or past
 * Mounted on /class
 * @author JJ
 * @module userClasses
 */

const express = require("express");
const router = express.Router();

const SQLdb = require("@enkeldigital/ce-sql");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:class");

/**
 * Get user's schedule/classes (both past and upcoming classes)
 * @name GET /class/user/:userID
 * @function
 * @todo Allow query strings to specify the date to filter by?
 * @param {String} [date] unix seconds
 * @returns {object} User class objects
 */
router.get("/user/:userID", express.json(), async (req, res) => {
  try {
    const { userID } = req.params;
    const { date } = req.query; // date === usersTodayTsInTheirTimeZone

    const userClasses = () =>
      SQLdb("userBookingTransactions")
        .where({ userID })
        .select("classID", "points", "startTime");

    // Order by startTime desc, so that the last upcoming class is first.
    // Frontend has to sort and filter this array somehow
    const classes = await userClasses().orderBy("startTime", "desc");

    // @todo limit the query? always allow all upcoming, only limit the past classes or allow some form of pagination

    // @todo Should we split up as past and upcoming for users? or should frontend handle this?
    res.status(200).json({ success: true, classes });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
