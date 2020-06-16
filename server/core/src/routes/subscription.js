/**
 * Express Router for subscription related routes
 * Mounted on /subscription
 * @author JJ
 * @module Subscription routes
 */

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const onlyOwnResource = require("../middleware/onlyOwnResource");

const db = require("../utils/db");
const getPlans = require("../db/getPlans");
const initializeUserPlan = require("../db/initializeUserPlan");

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
    const subscriptionPlans = subscriptionPlansSnapshot.docs.map((doc) =>
      doc.data()
    );

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
 * @returns {object} Full Subscription plan objects if any
 */
router.get("/:userID", auth, onlyOwnResource, async (req, res) => {
  try {
    const { userID } = req.params;

    const plans = await getPlans(userID);

    // If no plans doc, means first time using app
    if (!plans) {
      // @todo Might cause an issue if this fails
      await initializeUserPlan(userID);

      // Return with code for created
      return res.status(201).json({
        success: true,
        // Return the no plan object
        plans: {
          currentPlanID: null,
          nextPlanID: null,
        },
      });
    } else return res.status(200).json({ success: true, plans });
  } catch (error) {
    logger.error(error);
    res
      .status(error.code ? error.code : 500)
      .json({ success: false, error: error.message });
  }
});

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
      await db.collection("subscriptionPlans").doc(subscriptionPlanID).get()
    ).data();

    // If plan does not exist
    if (!subscriptionPlan)
      return res.status(404).json({
        success: false,
        error: "Invalid Subscription Plan ID",
      });

    // Get user's plan IDs
    const userPlan = (
      await db.collection("userPlans").doc(userID).get()
    ).data();

    // If user already has a currentPlan
    if (userPlan.currentPlanID) {
      // Set user's next month's plan
      await db.collection("subscriptions").doc(userID).update({
        nextPlanID: subscriptionPlanID,
      });

      // Set next plan. So the nxt time user reads from DB, they must modify it somehow....

      // Then update the Billing service and get back a resp

      return res.json({
        success: true,
        plans: {
          currentPlanID: userPlan.currentPlanID,
          nextPlanID: subscriptionPlanID,
        },
      });
    } else {
      // If user is new and does not have a plan, Set user's current plan
      await db.collection("subscriptions").doc(userID).update({
        currentPlanID: subscriptionPlanID,
      });

      return res.json({
        success: true,
        plans: {
          currentPlanID: subscriptionPlanID,
          nextPlanID: null,
        },
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
    // await db.collection("users").doc(userID).update({
    //   modifiedAt: FieldValue.serverTimestamp(),
    //   nextPlanID: null,
    // });

    res.json({ success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
