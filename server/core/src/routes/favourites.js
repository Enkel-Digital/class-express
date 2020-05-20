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

    const favouritesDoc = await db.collection("favourites").doc(userID).get();

    const favourites = favouritesDoc.data();

    // If user's first time calling favourites route
    if (!favourites) {
      const defaultFavoritesObject = { classes: {}, partners: {} };

      // Create new empty document
      db.collection("favourites").doc(userID).set(defaultFavoritesObject);

      return res.json({ success: true, favourites: defaultFavoritesObject });
    }

    return res.json({ success: true, favourites });
  } catch (error) {
    logger.error(error);
    res
      .status(error.code ? error.code : 500)
      .json({ success: false, error: error.message });
  }
});

/**
 * @todo Implement this scaffolded code.
 *
 * Update favourited classes
 * @name POST /favourites/classes/update
 * @function
 * @param {String} userID
 * @param {number} classID
 * @returns {object} success indicator
 */
router.post("/classes/update", express.json(), async (req, res) => {
  try {
    // Ensure that the email used as userID is lowercase.
    // Refer to notes for why we are enforcing this lowercase usage.
    const userID = req.body.userID.toLowerCase();
    req.body.user.email = req.body.user.email.toLowerCase();
    const user = req.body.user;

    // Create document in user with user's email as userID
    await db.collection("users").doc(userID).set(user);

    res.status(201).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
