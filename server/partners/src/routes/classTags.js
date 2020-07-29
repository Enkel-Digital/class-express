/**
 * Express Router for class tags related routes
 * Mounted on /tags/class
 * @author JJ
 * @module class tag routes
 *
 * No edit of tags, just delete the old one and insert a new one.
 */

const express = require("express");
const router = express.Router();
const SQLdb = require("@enkeldigital/ce-sql");
const auth = require("../middleware/auth");
const onlyOwnResource = require("../middleware/onlyOwnResource");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:users");

/**
 * Get all tags of a class
 * @name GET /tags/class/:classID
 * @param {String} classID
 * @returns {Array} An array of class tags
 */
router.get("/:classID", async (req, res) => {
  try {
    const { classID } = req.params;

    res.json({
      success: true,
      // Map it out to only contain the tag itself.
      tags: (await SQLdb("classTags").where({ classID }).select("tag")).map(
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
 * @param {String} classID
 * @param {Array} tags
 * @returns {object} success indicator
 */
router.post("/new", auth, onlyOwnResource, express.json(), async (req, res) => {
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
 * Delete tag of a class
 * @name DELETE /tags/class/:classID
 * @function
 * @param {String} classID
 * @param {Array} tags
 * @returns {object} success indicator
 */
router.delete(
  "/:classID",
  auth,
  onlyOwnResource,
  express.json(),
  async (req, res) => {
    try {
      const { classID, tags } = req.body;

      await Promise.all(
        tags.map((tag) =>
          SQLdb("classTags").where({ classID, tag: tag }).delete()
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
