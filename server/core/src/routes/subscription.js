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
const onlyOwnResource = require("../middleware/onlyOwnResource");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:subscription");

// Default points object for new user
const defaultPlansObject = {
  currentPlanID: null,
  nextPlanID: null
};

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
      // .where("available", "==", true) // Allow us to run campaigns for subscription plans
      .orderBy("id", "desc")
      .get();
    const subscriptionPlans = subscriptionPlansSnapshot.docs.map(doc => doc.data());

    res.json({ success: true, subscriptionPlans });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get users' subscription plan
 * @name GET /subscription/:userID
 * @function
 * @returns {object} IDs of users' subscription plans
 */
router.get("/:userID", auth, onlyOwnResource, async (req, res) => {
  try {
    const { userID } = req.params;

    const plansDoc = await db
      .collection("userPlans")
      .doc(userID)
      .get();

    let plans = plansDoc.data();

    // If no plans doc, means first time using app
    if (!plans) {
      // Create document with user's email and default plans object
      // Not awaiting for set to complete before replying user.
      // @todo Might cause an issue if this fails
      db.collection("userPlans")
        .doc(userID)
        .set(defaultPlansObject);

      // Set user's plans to the default plans object that was just set to DB
      plans = defaultPlansObject;
    }

    res.json({ success: true, plans });
  } catch (error) {
    logger.error(error);
    res.status(error.code ? error.code : 500).json({ success: false, error: error.message });
  }
});

module.exports = router;
