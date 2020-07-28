/**
 * Express Router for bookings related routes.
 * Mounted on /bookings
 * @author Jessica
 * @module Bookings routes
 */

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const SQLdb = require("@enkeldigital/ce-sql");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:bookings");

/**
 * Get all bookings of partner
 * @name GET /bookings/all/:partnerID
 * @function
 * @returns {object} Number of bookings and array of booking objects
 *
 * @todo Add a check to ensure only admins can read all employee details
 */
router.get("/all/:partnerID", async (req, res) => {
  try {
    const { partnerID } = req.params;

    const bookingsOfPartnerJoin = () =>
      SQLdb("classes")
        .join(
          "userBookingTransactions",
          "userBookingTransactions.classID",
          "=",
          "classes.id"
        )
        .where({
          partnerID,
        });

    const numberOfBookings = (
      await bookingsOfPartnerJoin()
        .count("partnerID") // Need to select a specific column to count and should avoid count(*) as some drivers do not support it.
        .first()
    ).count;

    const bookingsOfPartner = await bookingsOfPartnerJoin()
      .select(
        "userBookingTransactions.userID",
        "userBookingTransactions.points",
        "classes.name",
        "userBookingTransactions.classID"
      )
      .orderBy("classes.name", "desc");

    res.json({
      success: true,
      numberOfBookings,
      bookingsOfPartner,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
