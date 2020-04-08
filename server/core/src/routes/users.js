/**
 * Express Router for user related routes
 * Mounted on /user
 * @author JJ
 * @module User routes
 */

const express = require("express");
const router = express.Router();

const admin = require("firebase-admin");
let serviceAccount = require("../../serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
let db = admin.firestore();

/**
 * Get user details object
 * @name GET /user
 * @function
 * @returns {object} User object
 */
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();

    // snapshot.forEach(doc => {
    //   console.log(doc.id, "=>", doc.data());
    // });

    res.json({ success: true, snapshot });
  } catch (error) {
    console.log("Error getting documents", err);
  }
});

/**
 * Update user details object
 * @name PUT /user
 * @function
 * @returns {object} success indicator
 */
router.get("/", (req, res) => {
  res.json({ success: true });
});

module.exports = router;
