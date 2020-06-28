/**
 * Mounted on /topup
 * @author JJ
 * @module Topup routes
 *
 * This router is mounted on a auth protected route,
 * thus individual auth verifier middleware not needed
 */

const express = require("express");
const router = express.Router();
const SQLdb = require("@enkel-digital/ce-sql");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:topup");

/**
 * Get all topupOptions
 * @name GET /topup/options
 * @function
 * @returns {object} List of topup options
 */
router.get("/options", async (req, res) => {
  try {
    const topupOptions = await SQLdb("topupOptions")
      .where({
        // Allow us to run campaigns for subscription plans
        available: true,
        // Allow to select only plans valid for user's country.
        // countryCode: "SG",
      })
      .orderBy("price", "asc")
      .select("id", "name", "copywriting", "currency", "price", "totalPoints");

    res.json({ success: true, topupOptions });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @todo Implement this scaffolded route
 *
 * Purchase a topup. Uses Stripe API
 * @name POST /topup/new/:topupOptionID
 * @function
 * @returns {object} Success indicator
 */
router.post("/new/:topupOptionID", async (req, res) => {
  try {
    const { topupOptionID } = req.params;

    // Sort them by id asc
    const topupOptionsSnapshot = await db
      .collection("topupOptions")
      // .where("available", "==", true) // Allow us to run campaigns for topupOptions
      .orderBy("id", "desc")
      .get();
    const topupOptions = topupOptionsSnapshot.docs.map((doc) => doc.data());

    // Maybe have a webhook for stripe

    res.json({ success: true, topupOptions });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
