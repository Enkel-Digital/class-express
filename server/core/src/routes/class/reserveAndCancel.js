/**
 * Express Router for class related routes like reserving, cancelling a class and more
 * Mounted on /class
 * @author JJ
 * @module Class routes
 */

const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const SQLdb = require("@enkeldigital/ce-sql");
const { getUserPoints } = require("../../db/getPoints");

const { RRule, RRuleSet, rrulestr } = require("rrule");
const unixseconds = require("unixseconds");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:class");

/**
 * Reserve a class
 * @name POST /class/reserve
 * @param {String} userID
 * @param {String} classID
 * @param {Object} selectedTime
 * @returns {object} success indicator
 *
 * @todo Optimize by running some checks like the points and maxParticipants together in the background asynchronously and await Promise.all() on them
 */
router.post("/reserve", auth, express.json(), async (req, res) => {
  try {
    const { userID, classID, selectedTime } = req.body;

    // Check if class exists and is not deleted
    if (
      !(await SQLdb("classes").where({ id: classID, deleted: false }).first())
    )
      return res
        .status(404)
        .json({ success: false, error: "Class is deleted" });

    // @todo check the rrule in classes Schedule to see if the selected time is valid

    // Check if user have enough points for the class they are booking
    const { points: classPoints } = await SQLdb("classes")
      .where({ id: classID })
      .select("points")
      .first();

    const userPoints = await getUserPoints(userID);

    if (userPoints < classPoints)
      return res
        .status(400)
        .json({ success: false, error: "Not enough points" });

    // @todo Do the max participants check first before userPoints as this more likely

    // Check if class is fully booked
    // get maximum num of participants
    const { maxParticipants } = await SQLdb("classes")
      .where({ id: classID })
      .select("maxParticipants")
      .first();

    // get num of participants
    const currentNumOfParticipants = parseInt(
      (
        await SQLdb("userBookingTransactions")
          .where({
            classID,
            // @todo Fix this, without this check, maxParticipants becomes the value for the class across all its timings
            // selectedTime
          })
          .count("classID as currentNumOfParticipants")
          .first()
      ).currentNumOfParticipants
    );

    // If class is fully booked, end the transaction
    if (currentNumOfParticipants >= maxParticipants)
      return res
        .status(429) // @todo WRONG ERROR CODE
        .json({ success: false, error: "Class is fully booked" });

    // If all is ok, insert into DB
    // This also, "Deduct user's points" by inserting a new booking transaction. Since points is calculated using this recrds
    await SQLdb("userBookingTransactions").insert({
      userID,
      classID,
      points: classPoints,
      startTime: selectedTime,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Cancel a class reservation
 * @name POST /class/cancel
 * @param {String} userID
 * @param {String} classID
 * @param {Object} selectedTime
 * @returns {object} success indicator
 */
router.post("/cancel", auth, express.json(), async (req, res) => {
  try {
    const { userID, classID, selectedTime } = req.body;

    // user cannot delete a class that is after / ended / started?
    // cannot delete after ended, as partner simply wont get paid
    if (selectedTime <= unixseconds())
      return res
        .status(400) // @todo
        .json({ success: false, error: "Session is over. Unable to cancel" });

    // Delete the record from the database
    await SQLdb("userBookingTransactions")
      .where({
        userID,
        classID,
        // selectedTime
      })
      .del();

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
