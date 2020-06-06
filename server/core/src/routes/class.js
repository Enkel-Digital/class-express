/**
 * Express Router for class related routes like reserving, cancelling a class and more
 * Mounted on /class
 * @author JJ
 * @module Class routes
 */

const express = require("express");
const db = require("../utils/db");
const router = express.Router();
const auth = require("../middleware/auth");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:users");

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
 * Get schedule of a class for a particular date
 * @name GET /class/schedule/:classID/:date
 * @function
 * @returns {object} Schedule object
 */
router.get("/schedule/:classID/:date", async (req, res) => {
  try {
    const { classID, date } = req.params;

    // snapshot.forEach(doc => {
    //   console.log(doc.id, "=>", doc.data());
    // });

    res.json({ success: true, schedule: {} });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Reserve a class
 * @name POST /class/reserve
 * @function
 * @param {String} userID
 * @param {String} classID
 * @param {Object} selectedTime
 * @returns {object} success indicator
 */
router.post("/reserve", auth, express.json(), async (req, res) => {
  try {
    const { userID, classID, selectedTime } = req.body;
    res.status(200).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
