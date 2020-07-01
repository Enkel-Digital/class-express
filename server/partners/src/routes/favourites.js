/**
 * Express Router for favourites routes
 * Mounted on /favourites
 * @author JJ
 * @module Favourites routes
 *
 * This router is mounted on a auth protected route,
 * thus individual auth verifier middleware not needed
 */

const express = require("express");
const router = express.Router();
const SQLdb = require("@enkeldigital/ce-sql");
const onlyOwnResource = require("../middleware/onlyOwnResource");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:favourites");

/**
 * Get number of favourites for a particular class
 * @name GET /favourites/class/:classID
 * @function
 * @returns {object} favourites count
 */
router.get("/class/:classID", onlyOwnResource, async (req, res) => {
  try {
    const { classID } = req.params;

    return res.json({
      success: true,
      count: (
        await SQLdb("userFavourites")
          .where({ classID })
          .count("classID") // Need to select a specific column to count and should avoid count(*) as some drivers do not support it.
          .first()
      ).count,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get number of favourites for a particular partner
 * @name GET /favourites/partner/:partnerID
 * @function
 * @returns {object} favourites count
 */
router.get("/partner/:partnerID", onlyOwnResource, async (req, res) => {
  try {
    const { partnerID } = req.params;

    return res.json({
      success: true,
      count: (
        await SQLdb("userFavourites")
          .where({ partnerID })
          .count("partnerID") // Need to select a specific column to count and should avoid count(*) as some drivers do not support it.
          .first()
      ).count,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get number of favourites across all classes of a partner
 * @name GET /favourites/all-classes/of/:partnerID
 * @function
 * @returns {object} favourites count
 */
router.get("/all-classes/of/:partnerID", onlyOwnResource, async (req, res) => {
  try {
    const { partnerID } = req.params;

    return res.json({
      success: true,
      count: (
        await SQLdb("userFavourites")
          .join("classes", "userFavourites.classID", "=", "classes.id")
          .where({ "classes.partnerID": partnerID })
          .count("classID") // Need to select a specific column to count and should avoid count(*) as some drivers do not support it.
          .first()
      ).count,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
