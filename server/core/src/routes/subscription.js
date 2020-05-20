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

/**
 * @todo Implement all the scaffolded routes below
 */

/**
 * Update or purchase plans
 * @name POST /subscription/plans/update
 * @function
 * @param {String} userID
 * @param {String} subscriptionPlanID
 * @returns {object} success indicator
 */
router.post("/plans/update", auth, express.json(), async (req, res) => {
  try {
    const { userID, subscriptionPlanID } = req.body;

    // Get subscription plan with its ID and ensure it is valid
    const subscriptionPlan = (
      await db
        .collection("subscriptionPlans")
        .doc(subscriptionPlanID)
        .get()
    ).data();

    /* @todo so if subID doc does not exist, and I do .data() will it still work? */

    // If plan does not exist
    if (!subscriptionPlan)
      return res.status(404).json({
        success: false,
        error: "Invalid Subscription Plan ID"
      });

    // Get user's plan IDs
    const userPlan = (
      await db
        .collection("userPlans")
        .doc(userID)
        .get()
    ).data();

    // If user already has a currentPlan
    if (userPlan.currentPlanID) {
      // Set user's next month's plan
      await db
        .collection("subscriptions")
        .doc(userID)
        .update({
          nextPlanID: subscriptionPlanID
        });

      // Set next plan. So the nxt time user reads from DB, they must modify it somehow....

      // Then update the Billing service and get back a resp

      return res.json({
        success: true,
        plans: {
          currentPlanID: userPlan.currentPlanID,
          nextPlanID: subscriptionPlanID
        }
      });
    } else {
      // If user is new and does not have a plan, Set user's current plan
      await db
        .collection("subscriptions")
        .doc(userID)
        .update({
          currentPlanID: subscriptionPlanID
        });

      return res.json({
        success: true,
        plans: {
          currentPlanID: subscriptionPlanID,
          nextPlanID: null
        }
      });
    }

    // // Send user a email notification once subscription is updated
    // await sendMail({
    //   to: data.email,
    //   from: "billing@classexpress.com", // @todo Update this value and move it to a config file
    //   subject: "Successfully updated subscription plan!",
    //   html:
    //     `Request for subscription plan received<br />${new Date()}` +
    //     `<br />Email: ${data.email}<br />Name: ${data.name}<br />` +
    //     "New subscription plan will start from ... to ..."
    // });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Request to pause subscription plan
 * @name POST /subscription/pause
 * @function
 * @returns {object} success indicator
 */
router.post("/pause", auth, async (req, res) => {
  try {
    // Update subscription collection's document to set next month planID to null

    // Create document in user with user's email as userID
    await db
      .collection("users")
      .doc(userID)
      .update({
        modifiedAt: FieldValue.serverTimestamp(),
        nextPlanID: null
      });

    // Dont await this
    // Maybe this should be done in cloud functions?
    // Send email or update metrics dashboard to show analytics

    res.json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Request to cancel subscription plan
 * @name POST /subscription/cancel
 * @function
 * @returns {object} success indicator
 */
router.post("/cancel", auth, async (req, res) => {
  try {
    // Update subscription collection's document to set next month planID to null

    // Set a end date for the current plan.
    // If there is a next plan. Delete that document. Or make its start and end null to indicate nvr ran.
    await db
      .collection("users")
      .doc(userID)
      .update({
        modifiedAt: FieldValue.serverTimestamp(),
        nextPlanID: null
      });

    res.json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
