/**
 * Express Router for partner tags related routes
 * Mounted on /tags/partner
 * @author Jessica
 * @module partner tag routes
 *
 * No edit of tags, just delete the old one and insert a new one.
 */

const express = require("express");
const router = express.Router();
const SQLdb = require("@enkeldigital/ce-sql");
const getPartnerTags = require("../db/getPartnerTags");
const auth = require("../middleware/auth");
const onlyOwnResource = require("../middleware/onlyOwnResource");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:users");

/**
 * Get all tags of a partner
 * NOTICE This should normally not be used, as GET partner details will include the tags
 * @name GET /tags/partner/:partnerID
 * @function
 * @param {String} partnerID
 * @returns {Array} An array of partner tags
 */
router.get("/:partnerID", async (req, res) => {
  try {
    const { partnerID } = req.params;

    res.json({
      success: true,
      tags: await getPartnerTags(partnerID),
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Add new tag(s) for a partner
 * @name POST /tags/partner/new
 * @function
 * @param {String} partnerID
 * @param {Array} tags
 * @returns {object} success indicator
 */
router.post("/new", auth, onlyOwnResource, express.json(), async (req, res) => {
  try {
    const { partnerID, tags } = req.body;

    // @todo (Jess to implement) Prevent duplicate tags insertion

    // Insert the tags 1 by 1 and wait for all of them to complete.
    // @todo Can knex take in an array directly?
    await Promise.all(
      tags.map((tag) => SQLdb("partnerTags").insert({ partnerID, tag }))
    );

    res.status(201).json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Delete tag(s) of a partner
 * @name DELETE /tags/partner/:partnerID
 * @function
 * @param {String} partnerID
 * @param {Array} tags
 * @returns {object} success indicator
 */
router.delete(
  "/:partnerID",
  auth,
  onlyOwnResource,
  express.json(),
  async (req, res) => {
    try {
      const { partnerID, tags } = req.body;

      // @todo Can knex take in an array directly?
      await Promise.all(
        tags.map((tag) =>
          SQLdb("partnerTags").where({ partnerID, tag }).delete()
        )
      );

      res.status(201).json({ success: true });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

module.exports = router;
