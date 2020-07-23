/**
 * Router module for new routes
 * @author Zi Kang
 */

const express = require("express");
const router = express.Router();
const index = require("../utils/algolia");

async function partialUpdateObjectMiddleware(req, res) {
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
 * update class
 * @name PATCH /class/:id
 * @function
 * @param {object} record
 * @returns {object}
 */
router.patch(
  "/class/:id",
  express.json(),
  (req, _, next) => {
    req.body.objectID = `class${req.body.id}`;
    req.body.classID = req.body.id;
    return next();
  },
  partialUpdateObjectMiddleware
);

/**
 * update partner
 * @name PATCH /partner/:id
 * @function
 * @param {object} record
 * @returns {object}
 */
router.patch(
  "/partner/:id",
  express.json(),
  (req, _, next) => {
    req.body.objectID = `partner${req.body.id}`;
    req.body.partnerID = req.body.id;
    return next();
  },
  partialUpdateObjectMiddleware
);

module.exports = router;
