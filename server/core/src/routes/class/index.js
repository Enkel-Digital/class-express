/**
 * Express Router for class related routes like reserving, cancelling a class and more
 * Mounted on /class
 * @author JJ
 * @module Class routes
 */

const express = require("express");
const router = express.Router();
const moment = require("moment");
const { rrulestr } = require("rrule");
const SQLdb = require("@enkeldigital/ce-sql");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:class");

/**
 * Get class details
 * @name GET /class/details/:classID
 * @returns {object} Class object
 */
router.get("/details/:classID", async (req, res) => {
  try {
    const { classID } = req.params;

    const classObject = await SQLdb("classes")
      .where({ id: classID })
      .where("deleted", false)
      .first();

    if (classObject) res.json({ success: true, class: classObject });
    else res.status(404).json({ success: false, error: "No such Class" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Compute schedule of a class with given classID on the given date
 * @name GET /class/schedule/:classID/:date
 * @returns {object} Array of available timings for the selected class and date
 */
router.get("/schedule/:classID/:date?", async (req, res) => {
  try {
    const { classID } = req.params;

    const currentTime = req.params.date
      ? moment.unix(req.params.date)
      : moment.utc();
    const getCurrentTime = currentTime.clone;

    // Read rruleSetString from DB
    // Extra || gaurd with default empty object to guard against classes without a rrule to prevent destructing "undefined"
    const { rruleSetString } =
      (await SQLdb("classSchedule")
        .where({ classID })
        .select("rruleSetString")
        .first()) || {};

    if (!rruleSetString)
      return res.status(200).json({ success: true, schedule: [] });

    // Create new rruleSet using the rruleSetString from DB
    // Force it to always parse and return as a rruleSet instead of an rrule for compatibility
    const rruleSet = rrulestr(rruleSetString, { forceset: true });

    const start = getCurrentTime().startOf("day").toDate();
    const end = getCurrentTime().endOf("day").toDate();

    res.status(200).json({
      success: true,
      schedule: rruleSet.between(start, end, true),
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.use(require("./reserveAndCancel"));
router.use(require("./userClasses"));

module.exports = router;
