/**
 * Router module for new routes
 * @author Zi Kang
 */

const express = require("express");
const router = express.Router();
const index = require("../utils/algolia");
const transformID = require("../middleware/transformID");

// Middleware with shared business logic for adding new search objects to the algolia index.
async function addNewMW(req, res) {
  try {
    const {
      objectID,
      classID,
      partnerID,
      name,
      description,
      // eslint-disable-next-line camelcase
      location_address,
      pictureSources,
      points,
      _tags,
    } = req.body;

    const saveRecord = await index.saveObject({
      objectID,
      classID,
      partnerID,
      name,
      description,
      location_address,
      pictureSources,
      points,
      _tags,
    });

    if (!saveRecord) return res.json({ success: false, data: saveRecord });

    res.json({ success: true, data: saveRecord });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Add new class to the algolia search index
 * @name POST /new/class
 * @function
 * @param {object} record
 * @returns {object}
 */
router.post("/class", express.json(), transformID("class"), addNewMW);

/**
 * Add new partner to the algolia search index
 * @name POST /new/partner
 * @function
 * @param {object} record
 * @returns {object}
 */
router.post("/partner", express.json(), transformID("partner"), addNewMW);

module.exports = router;
