/**
 * Express Router for partner related routes.
 * Mounted on /partner
 * @author JJ
 * @module Partner routes
 */

const express = require("express");
const router = express.Router();
const SQLdb = require("@enkel-digital/ce-sql");

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

    const partner = await SQLdb("classes")
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

module.exports = router;
