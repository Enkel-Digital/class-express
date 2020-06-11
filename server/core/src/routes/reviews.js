/**
 * Express Router for review related routes.
 * Mounted on /reviews
 * @author JJ
 * @module Reviews routes
 */

const express = require("express");
const router = express.Router();
const firebase = require("firebase-admin");
const db = require("../utils/db");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:reviews");

/**
 * Get reviews for a class
 * @name GET /reviews/class/:classID
 * @function
 * @returns {object} Class Reviews object
 */
router.get("/class/:classID", async (req, res) => {
  try {
    const { classID } = req.params;

    const snapshot = await db.collection("reviews").doc(classID).get();
    const reviews = snapshot.data();

    // If no reviews, just reply with "undefined", frontend should handle and show no reviews.
    res.json({ success: true, reviews });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get reviews for a partner
 * @name GET /reviews/partner/:partnerID
 * @function
 * @returns {object} Partner Reviews object
 *
 * @todo To implement
 */
// router.get("/partner/:partnerID", async (req, res) => {
//   try {
//     const { partnerID } = req.params;

//     const snapshot = await db.collection("reviews").doc(partnerID).get();
//     const reviews = snapshot.data();

//     // If no reviews, just reply with "undefined", frontend should handle and show no reviews.
//     res.json({ success: true, reviews });
//   } catch (error) {
//     logger.error(error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

module.exports = router;
