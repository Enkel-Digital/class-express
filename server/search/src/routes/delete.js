/**
 * Router module for new routes
 * @author Zi Kang
 */

const express = require("express");
const router = express.Router();
const index = require("../utils/algolia");

async function deleteObjectMiddleware(req, res) {
  try {
    const { objectID } = req.body;

    const saveRecord = await index.deleteObject(objectID);

    if (!saveRecord) {
      return res.json({ success: false, data: saveRecord });
    }

    return res.json({ success: true, data: saveRecord });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Delete class object
 * @name DELETE /class/:id
 * @function
 * @param {object} record
 * @returns {object}
 */
router.delete(
  "/class/:id",
  express.json(),
  (req, _, next) => {
    req.body.objectID = `class${req.body.id}`;
    return next();
  },
  deleteObjectMiddleware
);

/**
 * Delete parter object
 * @name DELETE /partner/:id
 * @function
 * @param {object} record
 * @returns {object}
 */
router.delete(
  "/partner/:id",
  express.json(),
  (req, _, next) => {
    req.body.objectID = `partner${req.body.id}`;
    return next();
  },
  deleteObjectMiddleware
);

module.exports = router;
