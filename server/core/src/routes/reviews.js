/**
 * Express Router for review related routes.
 * Mounted on /reviews
 * @author JJ
 * @module Reviews routes
 */

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
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

/**
 * Leave a new review after user have attended a class
 * @name POST /reviews/new/:classID
 * @function
 * @param {String} userID
 * @param {String} description
 * @param {Number} points
 * @returns {object} Success indicator
 */
router.post("/new/:classID", auth, express.json(), async (req, res) => {
  try {
    const { classID } = req.params;
    const { description, points } = req.body;
    const userID = req.body.userID.toLowerCase();

    // Get the current number of reviews + 1?
    // @todo Might cause issues when dealing with multiple concurrent writes, might be better to use a random ID for the map key
    const count = ++(await db.collection("reviews").doc(classID).get()).data()
      .numberOfReviews;

    await db
      .collection("reviews")
      .doc(classID)
      .update({
        numberOfReviews: firebase.firestore.FieldValue.increment(1),
        [`userReviews.${count}`]: {
          userID, // @todo To change this as userID as email can be updated
          description,
          points,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        },
      });

    res.status(201).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
