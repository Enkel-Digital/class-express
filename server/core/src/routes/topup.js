/**
 * Mounted on /topup
 * @author JJ
 * @module Topup routes
 */

const express = require("express");
const router = express.Router();
const db = require("../utils/db");
const auth = require("../middleware/auth");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:subscription");

/**
 * Get all topupOptions
 * @name GET /topup/options
 * @function
 * @returns {object} List of topup options
 */
router.get("/options", auth, async (req, res) => {
  try {
    // Sort them by id asc
    const topupOptionsSnapshot = await db
      .collection("topupOptions")
      // .where("available", "==", true) // Allow us to run campaigns for topupOptions
      .orderBy("id", "desc")
      .get();
    const topupOptions = topupOptionsSnapshot.docs.map(doc => doc.data());

    res.json({ success: true, topupOptions });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
