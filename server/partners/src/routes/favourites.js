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
    // Then convert returned array into an object for easier access by the client.
    const favourites = {
      classes: (
        await SQLdb("userFavourites")
          .where({ userID })
          .whereNotNull("classID")
          .select("classID", "favouritedAt")
      ).reduce(function (acc, cur) {
        acc[cur.classID] = cur;
        delete acc[cur.classID].classID;
        return acc;
      }, {}),
      partners: (
        await SQLdb("userFavourites")
          .where({ userID })
          .whereNotNull("partnerID")
          .select("partnerID", "favouritedAt")
      ).reduce(function (acc, cur) {
        acc[cur.partnerID] = cur;
        delete acc[cur.partnerID].partnerID;
        return acc;
      }, {}),
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
    const { userID, classID, favourite } = req.body;
    if (!classID) throw new Error("Missing classID");

    if (favourite) {
      // Alternative solution to reading before writing to check for duplicates are
      // https://github.com/knex/knex/issues/1322
      // https://stackoverflow.com/questions/33540796/knexjs-if-not-exist-insert-else-update/35620251#35620251
      if (!(await SQLdb("userFavourites").where({ userID, classID }).first()))
        await SQLdb("userFavourites").insert({
          userID,
          classID,
          favouritedAt: favourite.favouritedAt
            ? favourite.favouritedAt
            : undefined,
        });
    } else {
      await SQLdb("userFavourites").where({ userID, classID }).del();
    }

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
    const { userID, partnerID, favourite } = req.body;
    if (!partnerID) throw new Error("Missing partnerID");

    if (favourite) {
      // Alternative solution to reading before writing to check for duplicates are
      // https://github.com/knex/knex/issues/1322
      // https://stackoverflow.com/questions/33540796/knexjs-if-not-exist-insert-else-update/35620251#35620251
      if (!(await SQLdb("userFavourites").where({ userID, partnerID }).first()))
        await SQLdb("userFavourites").insert({
          userID,
          partnerID,
          favouritedAt: favourite.favouritedAt
            ? favourite.favouritedAt
            : undefined,
        });
    } else {
      await SQLdb("userFavourites").where({ userID, partnerID }).del();
    }

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
