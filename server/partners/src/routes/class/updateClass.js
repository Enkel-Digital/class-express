/**
 * Express Router for updating a class
 * Mounted on /class
 * @author JJ
 * @module Update class route
 */

const express = require("express");
const router = express.Router();
const SQLdb = require("@enkeldigital/ce-sql");
const onlyOwnResource = require("../../middleware/onlyOwnResource");
const isSafeHTML = require("../../validations/isSafeHTML");
const search = require("@enkeldigital/ce-search-lib");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:users");

/**
 * Update partner's class
 * @todo Only allow partner or admin partner to call this API
 * @name PATCH /class/:classID
 * @param {String} classID
 * @param {Object} clas
 * @returns {object} success indicator
 */
router.patch("/:classID", express.json(), async (req, res) => {
  try {
    const { classID } = req.params;
    const { clas } = req.body;

    if (!isSafeHTML(clas.description))
      throw new Error("Class description is not a sanitized HTML.");

    // Read back all values from DB needed to update the search index instead of editing the request body clas object
    // Because the clas object from the request body usually is just a partial update for updates only.
    // Thus lack all the values needed to update the index.
    const readBackClass = (
      await SQLdb("classes")
        .where({ id: classID })
        .update(clas)
        .returning([
          "id",
          "partnerID",
          "name",
          "description",
          "length",
          "points",
          "walkIn",
          "pictureSources",
          "location_address",
        ])
    )[0];

    // @todo If this fails, we need to somehow allow a retry later.
    // Update class in the search index
    await search.classes.update(readBackClass, "class");

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
