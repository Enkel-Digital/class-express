/**
 * Express Router for review related routes.
 * Mounted on /reviews
 * @author JJ
 * @module Reviews routes
 *
 * @todo Add caching strategy for this routes as these are heavy SQL computations that can be cached
 */

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const SQLdb = require("@enkeldigital/ce-sql");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:reviews");

/**
 * Get reviews for a class
 * @name GET /reviews/class/:classID
 * @returns {object} Array of Class review objects
 */
router.get("/class/:classID", async (req, res) => {
  try {
    const { classID } = req.params;

    const numberOfReviews = (
      await SQLdb("reviews")
        .where({ classID })
        .count("classID") // Need to select a specific column to count and should avoid count(*) as some drivers do not support it.
        .first()
    ).count;

    const pointsArray = await SQLdb("reviews")
      .where({ classID })
      .select("points");

    const ratings =
      pointsArray.reduce((a, b) => a + b.points, 0) / pointsArray.length;

    const userReviews = await SQLdb("reviews")
      .where({ classID })
      .select("reviewedOn", "points", "description")
      // Arbitrary limit. @todo Allow scrolling/pagination
      .limit(12)
      .orderBy("reviewedOn", "desc");

    res.json({
      success: true,
      reviews: {
        numberOfReviews,
        // If no reviews, thus no ratings, use undefined to sent back nothing
        // Else, convert ratings to 1 d.p
        ratings: ratings ? ratings.toFixed(1) : undefined,
        userReviews,
      },
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get reviews for a partner
 * @name GET /reviews/partner/:partnerID
 * @returns {object} Partner Reviews object
 *
 * @todo To implement
 */
router.get("/partner/:partnerID", async (req, res) => {
  try {
    const { partnerID } = req.params;

    const partnerReviewsJoin = () =>
      SQLdb("reviews")
        .join("classes", "reviews.classID", "=", "classes.id")
        .where({ partnerID });

    const numberOfReviews = (
      await partnerReviewsJoin()
        .count("partnerID") // Need to select a specific column to count and should avoid count(*) as some drivers do not support it.
        .first()
    ).count;

    const pointsArray = await partnerReviewsJoin().select("reviews.points");

    const ratings =
      pointsArray.reduce((a, b) => a + b.points, 0) / pointsArray.length;

    // Include classID for the partner reviews
    const userReviews = await partnerReviewsJoin()
      .select(
        "reviewedOn",
        "reviews.classID",
        "reviews.points",
        "reviews.description"
      )
      // Arbitrary limit. @todo Allow scrolling/pagination
      .limit(12)
      .orderBy("reviewedOn", "desc");

    res.json({
      success: true,
      reviews: {
        numberOfReviews,
        // If no reviews, thus no ratings, use undefined to sent back nothing
        // Else, convert ratings to 1 d.p
        ratings: ratings ? ratings.toFixed(1) : undefined,
        userReviews,
      },
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Leave a new review after user have attended a class
 * @name POST /reviews/new/:classID
 * @param {String} userID
 * @param {String} description
 * @param {Number} points
 * @returns {object} Success indicator
 */
router.post("/new/:classID", auth, express.json(), async (req, res) => {
  try {
    const { classID } = req.params;
    const { userID, description, points } = req.body;

    if (!classID) throw new Error("Missing classID");

    await SQLdb("reviews").insert({
      classID,
      userID,
      description,
      points,
    });

    res.status(201).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
