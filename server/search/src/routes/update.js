/**
 * Router module for new routes
 * @author Zi Kang
 */

const express = require("express");
const router = express.Router();
const index = require("../utils/algolia");
const transformID = require("../middleware/transformID");

// Middleware with shared business logic for updating search objects in the algolia index.
async function updateMW(req, res) {
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

    const saveRecord = await index.partialUpdateObject(
      {
        objectID,
        classID,
        partnerID,
        name,
        description,
        location_address,
        pictureSources,
        points,
        _tags,
      },
      { createIfNotExists: false }
    );

    if (!saveRecord) {
      return res.json({ success: false, data: saveRecord });
    }

    return res.json({ success: true, data: saveRecord });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Update class search object in the algolia index.
 * @name PATCH /class/:id
 * @function
 * @param {object} record
 * @returns {object}
 */
router.patch("/class/:id", express.json(), transformID("class"), updateMW);

/**
 * Update partner search object in the algolia index.
 * @name PATCH /partner/:id
 * @function
 * @param {object} record
 * @returns {object}
 */
router.patch("/partner/:id", express.json(), transformID("partner"), updateMW);

module.exports = router;
