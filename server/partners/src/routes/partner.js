/**
 * Express Router for partner related routes.
 * Mounted on /partner
 * @author JJ
 * @module Partner routes
 */

const express = require("express");
const router = express.Router();
const SQLdb = require("@enkeldigital/ce-sql");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:partner");

/**
 * Get partner details
 * @name GET /partner/details/:partnerID
 * @function
 * @returns {object} Partner object
 */
router.get("/details/:partnerID", async (req, res) => {
  try {
    const { partnerID } = req.params;

    const partner = await SQLdb("partners")
      .where({ id: partnerID })
      .where("deleted", false)
      .first();

    if (partner) res.json({ success: true, partner });
    else res.status(404).json({ success: false, error: "No such Partner" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Update partner details
 * @name PATCH /partner/:partnerID
 * @function
 * @param {object} partner
 * @returns {object} Success indicator
 */
router.patch("/:partnerID", express.json(), async (req, res) => {
  try {
    const { partnerID } = req.params;
    const { partner } = req.body;

    await SQLdb("partners").where({ id: partnerID }).update(partner);

    res.json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Delete partner account
 * @name DELETE /partner/:partnerID
 * @function
 * @param {object} partner
 * @returns {object} Success indicator
 */
router.delete("/:partnerID", express.json(), async (req, res) => {
  try {
    const { partnerID } = req.params;

    await SQLdb("partners").where({ id: partnerID }).update({ deleted: true });

    res.json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @todo Create api for create new partner

module.exports = router;
