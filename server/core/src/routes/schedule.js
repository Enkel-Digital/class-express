/**
 * Express Router for class schedule's and class schedule's of a partner
 * Mounted on /schedule
 * @author JJ
 * @module Schedule routes
 */

const express = require("express");
const router = express.Router();
const moment = require("moment");
const { rrulestr } = require("rrule");
const SQLdb = require("@enkeldigital/ce-sql");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:schedule");

/**
 * Test for all occurences in the rrule using given date
 * @param {object} rruleSet rRule set object from rrule library
 * @param {moment} dateToCheck Moment object of the date to check
 * @returns {Array<Number>} Array of unix seconds if any for all occurences that lies between the start and end of the given date
 */
function onThisDay(rruleSet, dateToCheck) {
  // Get start and end time of selected date to test for timings/occurence between them
  const start = dateToCheck.clone().startOf("day").toDate();
  const end = dateToCheck.clone().endOf("day").toDate();

  // return rruleSet.between(start, end, true);

  // @todo For the moment creation, do I need to set utc or smth?
  // rruleSet.between returns an array of date strings, which is converted to an array of unix seconds for consistency throughout the system
  return rruleSet.between(start, end, true).map((date) => moment(date).unix());
}

/**
 * Get the schedule of a single class
 * @function getScheduleOfClass
 * @param {*} classID
 * @param {Number} [date=moment.utc()] Date as unix seconds in UTC to check schedule for. Defaults to unix seconds in utc of execution
 * @returns {Array<Date>} An array of date objects representing all the time's this class is scheduled for on the selected Date.
 */
async function getScheduleOfClass(classID, date) {
  // @todo Instead of date, it should be better named as timestamp or smth
  const currentTime = date ? moment.unix(date) : moment.utc();

  // Read rruleSetString from DB
  // Extra || gaurd with default empty object to guard against classes without a rrule to prevent destructing "undefined"
  const { rruleSetString } =
    (await SQLdb("classSchedule")
      .where({ classID })
      .select("rruleSetString")
      .first()) || {};

  // Return empty array schedule if no rruleSet is available as partner may have created a class but have not set its schedule yet.
  if (!rruleSetString) return [];

  // Create new rruleSet using the rruleSetString from DB
  // Force it to always parse and return as a rruleSet instead of an rrule for compatibility
  const rruleSet = rrulestr(rruleSetString, { forceset: true });

  // @todo Remove after testing is done
  // console.log("1", start, end);
  // console.log("2", rruleSet.all());
  // console.log("3", rruleSet.between(start, end, true));

  return onThisDay(rruleSet, currentTime);
}

/**
 * Compute schedule of a class with given classID on the given date
 * @name GET /schedule/class/:classID/:date?
 * @param {String} classID
 * @param {Number} [date] Date in unix seconds only
 * @returns {object} Array of available timings for the selected class and date
 */
router.get("/class/:classID/:date?", async (req, res) => {
  try {
    const { classID, date } = req.params;

    res.status(200).json({
      success: true,
      schedule: await getScheduleOfClass(classID, date),
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Compute schedule of a partner with given partnerID on the given date
 * @todo Move this to partner API instead
 * @todo Fix this following API change of the onThisDay function
 * @name GET /schedule/partner/:partnerID/:date?
 * @returns {object} Array of available timings for classes of the selected partner and date
 */
router.get("/partner/:partnerID/:date?", async (req, res) => {
  try {
    const { partnerID } = req.params;

    // Get all classes of a partner
    const classIDs = (
      await SQLdb("classes").where({ partnerID }).select("id")
    ).map((clas) => clas.id);

    const schedules = await Promise.all(
      classIDs.map((classID) => getScheduleOfClass(classID, req.params.date))
    );

    // Get and sort partnerSchedule by looping over and getting schedules of all classes of partner
    const partnerSchedule = (
      await Promise.all(
        classIDs.map(async (classID) =>
          (await getScheduleOfClass(classID, req.params.date)).map((time) => ({
            classID,
            time,
          }))
        )
      )
    )
      .flat()
      .sort((a, b) => a.time - b.time);

    res.status(200).json({
      success: true,
      schedule: partnerSchedule,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
