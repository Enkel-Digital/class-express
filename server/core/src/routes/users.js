/**
 * Express Router for user related routes
 * Mounted on /user
 * @author JJ
 * @module User routes
 */

const express = require("express");
const db = require("../utils/db");
const router = express.Router();

/**
 * Get user details object
 * @name GET /user/:userID
 * @function
 * @returns {object} User object
 */
router.get("/:userID", async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();

    console.log("snapshot", snapshot);

    // snapshot.forEach(doc => {
    //   console.log(doc.id, "=>", doc.data());
    // });

    res.json({ success: true, snapshot });
  } catch (error) {
    console.log("Error getting documents", error);
  }
});

/**
 * Update user details object
 * @name PUT /user/:userID
 * @function
 * @returns {object} success indicator
 */
router.get("/", (req, res) => {
  res.json({ success: true });
});

module.exports = router;
