/**
 * Router module for new routes
 * @author Zi Kang
 */

const express = require("express");
const router = express.Router();
const index = require("../utils/algolia");

async function addNewObjectMiddleware(req, res) {
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
    });

    if (!saveRecord) {
      return res.json({ success: false, data: saveRecord });
    }

    return res.json({ success: true, data: saveRecord });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Create new class
 * @name POST /new/class
 * @function
 * @param {object} record
 * @returns {object}
 */
router.post(
  "/class",
  express.json(),
  (req, _, next) => {
    req.body.objectID = `class${req.body.id}`;
    req.body.classID = req.body.id;
    return next();
  },
  addNewObjectMiddleware
);

/**
 * Create new partner
 * @name POST /new/partner
 * @function
 * @param {object} record
 * @returns {object}
 */
router.post(
  "/partner",
  express.json(),
  (req, _, next) => {
    req.body.objectID = `partner${req.body.id}`;
    req.body.partnerID = req.body.id;
    return next();
  },
  addNewObjectMiddleware
);

module.exports = router;
