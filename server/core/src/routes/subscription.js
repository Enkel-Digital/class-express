/**
 * Express Router for subscription related routes
 * Mounted on /subscription
 * @author JJ
 * @module Subscription routes
 */

const express = require("express");
const router = express.Router();
const firebase = require("firebase-admin");
const db = require("../utils/db");
const auth = require("../middleware/auth");
const onlyOwnResource = require("../middleware/onlyOwnResource");

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
        .set({
          // Set count (number of plans) to 0 to indicate new user with no plans yet
          count: 0
        });

      res.json({
        success: true,
        // Return the no plan object
        plans: {
          currentPlanID: null,
          nextPlanID: null
        }
      });
    } else {
      // If latest plan has already started
      if (plans[plans.count].start.seconds <= firebase.firestore.Timestamp.now().seconds)
        res.json({
          success: true,
          plans: {
            currentPlanID: plans[plans.count].planID,
            nextPlanID: plans[plans.count].planID // Same plan for next month since there is no other specified plan
          }
        });
      // Else if still on second last plan for current plan period
      else if (plans[plans.count - 1].end.seconds > firebase.firestore.Timestamp.now().seconds)
        res.json({
          success: true,
          plans: {
            currentPlanID: plans[plans.count - 1].planID,
            nextPlanID: plans[plans.count].planID
          }
        });
      // Else no plan right now
      else {
        // @todo Implement psuedo code
        // // If there are plans but no valid plan running now, it might mean user paused subscription
        // if (paused)
        //   res.json({
        //     success: true,
        //     paused: true
        //   });
        // // Else it could also mean user cancelled subscription
        // else if (cancelled)
        //   res.json({
        //     success: true,
        //     plans: {
        //       currentPlanID: null,
        //       nextPlanID: null
        //     }
        //   });
      }
    }
  } catch (error) {
    logger.error(error);
    res.status(error.code ? error.code : 500).json({ success: false, error: error.message });
  }
});

module.exports = router;
