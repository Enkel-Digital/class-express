/**
 * Router module for new routes
 * @author Zi Kang
 */

const express = require("express");
const router = express.Router();
const index = require("../utils/algolia");
const transformID = require("../middleware/transformID");

// Middleware with shared business logic for deleting search objects from the algolia index.
async function deleteMW(req, res) {
  try {
    const saveRecord = await index.deleteObject(req.body.objectID);

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
router.delete("/class/:id", express.json(), transformID("class"), deleteMW);

/**
 * Delete parter object
 * @name DELETE /partner/:id
 * @function
 * @param {object} record
 * @returns {object}
 */
router.delete("/partner/:id", express.json(), transformID("partner"), deleteMW);

module.exports = router;
