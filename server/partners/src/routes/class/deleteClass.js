/**
 * Express Router for deleting a class
 * Mounted on /class
 * @author JJ
 * @module Update class route
 */

const express = require("express");
const router = express.Router();
const SQLdb = require("@enkeldigital/ce-sql");
const onlyOwnResource = require("../../middleware/onlyOwnResource");
const search = require("@enkeldigital/ce-search-lib");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:users");

/**
 * Delete a class
 * @todo Only allow partner or admin partner to call this API
 * @name DELETE /classs/:classID
 * @function
 * @param {String} classID
 * @returns {object} Success indicator
 */
router.delete("/:classID", express.json(), async (req, res) => {
  try {
    const { classID } = req.params;

    // @todo Might want to update the way of deleting, and actually deleting the class instead of setting delete to true
    await SQLdb("classes").where({ id: classID }).update({ deleted: true });

    // @todo If this fails, we need to somehow allow a retry later.
    // Remove this class from the search index
    await search.del(classID, "class");

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
