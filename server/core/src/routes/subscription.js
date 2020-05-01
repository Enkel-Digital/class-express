/**
 * Express Router for subscription related routes
 * Mounted on /subscription
 * @author JJ
 * @module Subscription routes
 */

const express = require("express");
const router = express.Router();
const db = require("../utils/db");
const auth = require("../middleware/auth");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:subscription");

/**
 * Get subscriptionplans
 * @name GET /subscription/plans/all
 * @function
 * @returns {object} List of subscription plans
 */
router.get("/plans/all", auth, async (req, res) => {
  try {
    // Sort them by id asc
    const subscriptionPlansSnapshot = await db
      .collection("subscriptionPlans")
      .orderBy("id", "desc")
      .get();
    const subscriptionPlans = subscriptionPlansSnapshot.docs.map(doc => doc.data());

    res.json({ success: true, subscriptionPlans });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
