/**
 * Express Router for class tags related routes
 * Mounted on /tags/partner
 * @author Jessica
 * @module partner tag routes
 *
 * No edit of tags, just delete the old one and insert a new one.
 *
 * This router is mounted on a auth protected route,
 * thus individual auth verifier middleware not needed
 */

const express = require("express");
const router = express.Router();
const SQLdb = require("@enkeldigital/ce-sql");
const onlyOwnResource = require("../middleware/onlyOwnResource");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:users");

/**
 * Get all tags of a partner
 * @name GET /tags/partner/:partnerID
 * @function
 * @param {String} partnerID
 * @returns {Array} An array of partner tags
 */
router.get("/:partnerID", onlyOwnResource, async (req, res) => {
  try {
    const { partnerID } = req.params;

    res.json({
      success: true,
      // Map it out to only contain the tag itself.
      tags: (await SQLdb("partnerTags").where({ partnerID }).select("tag")).map(
        (tagObject) => tagObject.tag
      ),
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Add new tag(s) for a class
 * @name POST /tags/class/new
 * @function
 * @param {String} classID
 * @param {Array} tags
 * @returns {object} success indicator
 */
router.post("/new", express.json(), async (req, res) => {
  try {
    const { classID, tags } = req.body;

    // @todo (Jess to implement) Prevent duplicate tags insertion

    // Insert the tags 1 by 1 and wait for all of them to complete.
    await Promise.all(
      tags.map((tag) => SQLdb("classTags").insert({ classID, tag }))
    );

    res.status(201).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Delete tag of a partner
 * @name DELETE /tags/partner/:partnerID
 * @function
 * @param {String} partnerID
 * @param {Array} tags
 * @returns {object} success indicator
 */
router.delete("/:partnerID", express.json(), async (req, res) => {
  try {
    const { partnerID, tags } = req.body;

    await Promise.all(
      tags.map((tag) =>
        SQLdb("partnerTags").where({ partnerID, tag: tag }).delete()
      )
    );

    res.status(201).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
