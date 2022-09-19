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
const SQLdb = require("@enkeldigital/ce-sql");
const auth = require("../middleware/auth");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:topup");

/**
 * Get all topupOptions
 * @name GET /topup/options
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
 * Purchase a topup. Uses Stripe API / Billing service
 * @name POST /topup/purchase
 * @param userID
 * @param topupID
 * @returns {object} Success indicator
 */
router.post("/purchase", auth, express.json(), async (req, res) => {
  try {
    const { userID, topupID } = req.body;

    // @todo Make sure topupID and userID is valid

    // Maybe have a webhook for stripe
    // Call billing service to charge user

    await SQLdb("userTopups").insert({ userID, topupID });

    res.json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
