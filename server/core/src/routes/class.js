/**
 * Express Router for class related routes like reserving, cancelling a class and more
 * Mounted on /class
 * @author JJ
 * @module Class routes
 */

const express = require("express");
const db = require("../utils/db");
const router = express.Router();

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:users");

/**
 *
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
    else res.status(404).json({ success: false, error: "Invalid classID" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get class object
 * @name GET /class/:classID
 * @function
 * @returns {object} Class object
 */
router.get("/:classID", async (req, res) => {
  try {
    const snapshot = await db.collection("class").get();

    // snapshot.forEach(doc => {
    //   console.log(doc.id, "=>", doc.data());
    // });

    res.json({ success: true, snapshot });
  } catch (error) {
    console.log("Error getting documents", error);
  }
});

/**
 * Update class object
 * @name PUT /class/:classID
 * @function
 * @returns {object} success indicator
 */
router.get("/:classID", (req, res) => {
  res.json({ success: true });
});

module.exports = router;
