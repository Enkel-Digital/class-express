/**
 * Express Router for partner related routes.
 * Mounted on /partner
 * @author JJ
 * @module Partner routes
 */

const express = require("express");
const db = require("../utils/db");
const router = express.Router();

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

    const snapshot = await db.collection("partners").doc(partnerID).get();
    const partner = snapshot.data();

    if (partner) res.json({ success: true, partner });
    else res.status(404).json({ success: false, error: "No such Partner" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
