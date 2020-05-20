/**
 * Express Router for class related routes
 * Mounted on /class
 * @author JJ
 * @module Class routes
 */

const express = require("express");
const db = require("../utils/db");
const router = express.Router();

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
