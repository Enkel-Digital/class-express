/**
 * Router module for new routes
 * @author Zi Kang
 */

const express = require("express");
const router = express.Router();
const index = require("../utils/algolia");

async function addNewObjectsMiddleware(req, res) {
  try {
    req.body = req.body.map((reqBody) => ({
      objectID: reqBody.objectID,
      classID: reqBody.classID,
      partnerID: reqBody.partnerID,
      name: reqBody.name,
      description: reqBody.description,
      // eslint-disable-next-line camelcase
      location_address: reqBody.location_address,
      pictureSources: reqBody.pictureSources,
      points: reqBody.points,
    }));

    const saveRecord = await index.saveObjects(req.body);

    if (!saveRecord) {
      return res.json({ success: false, data: saveRecord });
    }

    return res.json({ success: true, data: saveRecord });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Import class data
 * @name POST /new/bulk/class
 * @function
 * @param {object} record
 * @returns {object}
 */
router.post(
  "/class",
  express.json(),
  (req, _, next) => {
    req.body = req.body.map((record) => {
      record.objectID = `class${record.id}`;
      record.classID = record.id;
      return record;
    });

    return next();
  },
  addNewObjectsMiddleware
);

/**
 * Import partner data
 * @name POST /new/partner/bulk
 * @function
 * @param {object} record
 * @returns {object}
 */
router.post(
  "/partner",
  express.json(),
  (req, _, next) => {
    req.body = req.body.map((record) => {
      record.objectID = `partner${record.id}`;
      record.partnerID = record.id;
      return record;
    });

    return next();
  },
  addNewObjectsMiddleware
);

module.exports = router;
