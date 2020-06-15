/**
 * Express Router for class related routes like reserving, cancelling a class and more
 * Mounted on /class
 * @author JJ
 * @module Class routes
 */

const express = require("express");
const db = require("../../utils/db");
const router = express.Router();
const { RRule, RRuleSet, rrulestr } = require("rrule");
const auth = require("../../middleware/auth");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:class");

/**
 * Get class details
 * @name GET /class/details/:classID
 * @function
 * @returns {object} Class object
 */
router.get("/details/:classID", async (req, res) => {
  try {
    const { classID } = req.params;

    const snapshot = await db.collection("classes").doc(classID).get();
    const classObject = snapshot.data();

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
 * @function
 * @returns {object} Schedule object
 */
router.get("/schedule/:classID/:date", async (req, res) => {
  try {
    const { classID, date } = req.params;

    res.json({ success: true, schedule: {} });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
