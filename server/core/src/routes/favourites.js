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
const firebase = require("firebase-admin");
const SQLdb = require("@enkel-digital/ce-sql");
const onlyOwnResource = require("../middleware/onlyOwnResource");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:favourites");

/**
 * Get users' favourites, including BOTH favourite classes and favourite partners
 * @name GET /favourites/:userID
 * @function
 * @returns {object} favourites object
 */
router.get("/:userID", onlyOwnResource, async (req, res) => {
  try {
    const { userID } = req.params;

    // Filter for class and partners here instead of doing it on the frontend for better performance
    const favourites = {
      classes: await SQLdb("userFavourites")
        .where({ userID })
        .whereNotNull("classID"),
      partners: await SQLdb("userFavourites")
        .where({ userID })
        .whereNotNull("partnerID"),
    };

    return res.json({ success: true, favourites });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Favourite or un-favourite a class
 * @name POST /favourites/classes/update
 * @function
 * @param {String} userID
 * @param {number} classID Class with classID to update favourite status
 * @param {boolean} favourite True to set as favourite and false to unfavourite
 * @returns {object} success indicator
 */
router.post("/classes/update", express.json(), async (req, res) => {
  try {
    // Ensure that the email used as userID is lowercase.
    // Refer to notes for why we are enforcing this lowercase usage.
    const userID = req.body.userID.toLowerCase();
    const { classID, favourite } = req.body;

    if (!classID) throw new Error("Missing classID");

    if (favourite)
      await db
        .collection("favourites")
        .doc(userID)
        .update({
          [`classes.${classID}`]: favourite,
        });
    else
      await db
        .collection("favourites")
        .doc(userID)
        .update({
          [`classes.${classID}`]: firebase.firestore.FieldValue.delete(),
        });

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Favourite or un-favourite a partner
 * @name POST /favourites/partner/update
 * @function
 * @param {String} userID
 * @param {number} partnerID Partner with partnerID to update favourite status
 * @param {boolean} favourite True to set as favourite and false to unfavourite
 * @returns {object} success indicator
 */
router.post("/partner/update", express.json(), async (req, res) => {
  try {
    // Ensure that the email used as userID is lowercase.
    // Refer to notes for why we are enforcing this lowercase usage.
    const userID = req.body.userID.toLowerCase();
    const { partnerID, favourite } = req.body;

    if (!partnerID) throw new Error("Missing partnerID");

    if (favourite)
      await db
        .collection("favourites")
        .doc(userID)
        .update({
          [`partners.${partnerID}`]: favourite,
        });
    else
      await db
        .collection("favourites")
        .doc(userID)
        .update({
          [`partners.${partnerID}`]: firebase.firestore.FieldValue.delete(),
        });

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
