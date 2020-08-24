/**
 * Express Router for partner related routes.
 * Mounted on /partner
 * @author JJ
 * @module Partner routes
 */

const express = require("express");
const router = express.Router();
const SQLdb = require("@enkeldigital/ce-sql");
const getPartnerTags = require("../db/getPartnerTags");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:partner");

/**
 * Get partner details with its tags
 * @name GET /partner/details/:partnerID
 * @returns {object} Partner object
 */
router.get("/details/:partnerID", async (req, res) => {
  try {
    const { partnerID } = req.params;

    const partner = await SQLdb("partners")
      .where({ id: partnerID })
      .where("deleted", false)
      .first();

    if (!partner)
      return res.status(404).json({ success: false, error: "No such Partner" });

    // @todo Can we achieve this using a SQL JOIN?
    // Inject partnerTags in as an array
    partner.tags = await getPartnerTags(partnerID);

    res.json({ success: true, partner });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
