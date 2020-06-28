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
const SQLdb = require("@enkel-digital/ce-sql");

const createLogger = require("@lionellbriones/logging").default;
const logger = createLogger("routes:subscription");
const moment = require("moment");
const unixseconds = require("unixseconds");

/**
 * Get subscriptionplans
 * @name GET /subscription/plans/all
 * @function
 * @returns {object} List of subscription plans
 */
router.get("/plans/all", async (req, res) => {
  try {
    const subscriptionPlans = await SQLdb("subscriptionPlans")
      .where({
        // Allow us to run campaigns for subscription plans
        available: true,
        // Allow to select only plans valid for user's country.
        // countryCode: "SG",
      })
      .orderBy("price", "asc")
      .select("id", "name", "copywriting", "currency", "price", "totalPoints");

    res.json({ success: true, subscriptionPlans });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const periodLengthInSeconds = 30 * 24 * 60 * 60; // 30 days, 24 hours, 60 mins, 60 seconds

function getCurrentPlan(userID, nowTS) {
  return SQLdb("userPlans")
    .where({ userID })
    .where("start", "<", nowTS) // If already started
    .where(function () {
      // And doesnt have a end date Or if the end date is past the current date
      this.whereNull("end").orWhere("end", ">", nowTS);
    })
    .first(); // Although always be 1, first is still used to get object form instead of a 1 element array
}

function getNextPlan(userID, nowTS) {
  // Where plan has yet to start
  return SQLdb("userPlans")
    .where({ userID })
    .where("start", ">", nowTS)
    .first(); // Although always be 1, first is still used to get object form instead of a 1 element array
}

/**
 * Get users' subscription plan
 * @name GET /subscription/:userID
 * @function
 * @returns {object} Full Subscription plan objects if any
 */
router.get("/:userID", auth, onlyOwnResource, async (req, res) => {
  try {
    const { userID } = req.params;

    // Call once to pass currentPlan and nextPlan the same value for each API call
    const nowTS = unixseconds();

    return res.status(200).json({
      success: true,
      plans: {
        // If none, undefined will be returned and frontend can handle it.
        current: await getCurrentPlan(userID, nowTS),
        next: await getNextPlan(userID, nowTS),
      },
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
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
router.post(
  "/plans/update",
  auth,
  onlyOwnResource,
  express.json(),
  async (req, res) => {
    try {
      const { userID, subscriptionPlanID } = req.body;

      // Ensure planID is valid, even though a bad insert will also throw, but doing this check for consistency
      if (
        !(await SQLdb("subscriptionPlans")
          .where({ id: subscriptionPlanID })
          .first())
      )
        return res
          .status(400)
          .json({ success: false, error: "Invalid subscriptionPlanID" });

      // Call once to pass currentPlan and nextPlan the same value for each API call
      const nowTS = unixseconds();

      // Get user's plans
      const currentPlan = await getCurrentPlan(userID, nowTS);
      const nextPlan = await getNextPlan(userID, nowTS);

      // If user already has a currentPlan
      if (currentPlan) {
        // Update user's current plan to end after their current period
        currentPlan.update({
          end, // use moment to calculate end of period
        });

        // @todo check if they have a next plan already

        // Set user's next plan
        await SQLdb("userPlans").insert({
          userID,
          planID: subscriptionPlanID,
          // start, // use moment to calculate start of next period
          // end, //
        });

        // @todo Then update the Billing service and get back a resp

        return res.json({ success: true });
      } else if (!nextPlan) {
        // If user is new and does not have a plan, and does not have a next plan, Set user's current plan
        await SQLdb("userPlans").insert({
          userID,
          planID: subscriptionPlanID,
          start: nowTS,
          end: null,
        });

        return res.json({ success: true });
      } else {
        // @todo To handle this case
        return res.json({ success: false, error: "CASE TOO BE HANDLED" });
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
  }
);

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
