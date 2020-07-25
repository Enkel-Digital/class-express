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
 * Get the schedule of a single class
 * @function getScheduleOfClass
 * @param {*} classID
 * @param {Number} [date=moment.utc()] Date as unix seconds in UTC to check schedule for. Defaults to unix time of execution
 * @returns {Array<Date>} An array of date objects representing all the time's this class is scheduled for on the selected Date.
 */
async function getScheduleOfClass(classID, date) {
  const currentTime = date ? moment.unix(date) : moment.utc();

  // Due to some weird magic prototype shit, we cannot write it simply as this, and instead need to wrap it in a function
  // const getCurrentTime = currentTime.clone;
  const getCurrentTime = () => currentTime.clone();

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

  const start = getCurrentTime().startOf("day").toDate();
  const end = getCurrentTime().endOf("day").toDate();

  // @todo Remove after testing is done
  // console.log("1", start, end);
  // console.log("2", rruleSet.all());
  // console.log("3", rruleSet.between(start, end, true));

  return rruleSet.between(start, end, true);
}

/**
 * Compute schedule of a class with given classID on the given date
 * @name GET /schedule/class/:classID/:date
 * @returns {object} Array of available timings for the selected class and date
 */
router.get("/class/:classID/:date?", async (req, res) => {
  try {
    const { classID } = req.params;

    res.status(200).json({
      success: true,
      schedule: await getScheduleOfClass(classID, req.params.date),
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Compute schedule of a partner with given partnerID on the given date
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
