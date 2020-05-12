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
const db = require("../utils/db");
const onlyOwnResource = require("../middleware/onlyOwnResource");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:users");

/**
 * Get users' favourites, including BOTH favourite classes and favourite partners
 * @name GET /favourites/:userID
 * @function
 * @returns {object} favourites object
 */
router.get("/:userID", onlyOwnResource, async (req, res) => {
  try {
    const { userID } = req.params;

    const favouritesDoc = await db
      .collection("favourites")
      .doc(userID)
      .get();

    const favourites = favouritesDoc.data();

    // If user's first time calling favourites route
    if (!favourites) {
      const defaultFavoritesObject = { classes: {}, partners: {} };

      // Create new empty document
      db.collection("favourites")
        .doc(userID)
        .set(defaultFavoritesObject);

      return res.json({ success: true, favourites: defaultFavoritesObject });
    }

    return res.json({ success: true, favourites });
  } catch (error) {
    logger.error(error);
    res.status(error.code ? error.code : 500).json({ success: false, error: error.message });
  }
});

module.exports = router;
