/**
 * DB abstraction over user's subscription plans
 * @author JJ
 * @module getPlans
 *
 * @todo Optimize reads by doing reverse loops on all plans. Look from latest plan to oldest instead of the other way round.
 */

const firebase = require("firebase-admin");
const db = require("../utils/db");

/**
 * Below are the utility functions to test for the different statuses
 * Status test cases (status is always generated): NORMAL/CANCELLED/CANCELLING
 * Enforce use of undefined over boolean false so that when the JSON data is encoded and sent over, undefineds are ignored
 * @todo Introduce pause and pausing test cases.
 */

/**
 * There is a plan for this period, and this plan has no end date yet.
 * OR
 * There is a plan for this period, and a different plan for next period, where the next plan has no end date yet.
 */
const isNormal = (currentPlan, nextPlan, count) =>
  currentPlan && nextPlan ? true : undefined;

/**
 * No plans currently but previously had plans.
 * If there is no current and next plan, AND count is more than 0.
 */
const isCancelled = (currentPlan, nextPlan, count) =>
  currentPlan === undefined && nextPlan === undefined && count
    ? true
    : undefined;

/**
 * There is a current plans but no more plan from next period onwards.
 * If there is a plan in this period, BUT the plan ENDS on the last day of this period with no future plans.
 */
const isCancelling = (currentPlan, nextPlan, count) =>
  currentPlan && nextPlan === undefined ? true : undefined;

/**
 * Below are utility functions to test if plan is current or next
 */

/**
 * If plan havent end && plan started --> If nowTS is sandwiched between start and end
 * @returns {Boolean} if given plan is the current plan
 */
function isCurrent(nowTS, plan) {
  if (plan.end.seconds === null || plan.end.seconds > nowTS)
    if (plan.start.seconds < nowTS) return plan;
}

/**
 * If plan havent start --> If nowTS is before the start timestamp
 * @returns {Boolean} if given plan is the next plan
 */
function isNext(nowTS, plan) {
  if (plan.start.seconds > nowTS) return plan;
}

/**
 * Get user's current plan's ID.
 */
function getCurrentPlan(nowTS, plans, count) {
  // Reverse loop starting from the last entered plan entry
  for (const key in plans) if (isCurrent(nowTS, plans[key])) return plans[key];
}

/**
 * Get user's next plan's ID.
 * @todo A simpler way to calculate next plan ID is to trust "count" and use plan with count as key
 * @todo So bascially if (isNext(nowTS, plans[count])) return plans[count];
 */
function getNextPlan(nowTS, plans, count) {
  for (const key in plans) if (isNext(nowTS, plans[key])) return plans[key];
}

/**
 * Transforms the timestamp values in plan to just be plain unix timestamp (seconds) from the firestore format
 * @function transformPlanTS
 * @param {object} plan Plan object obtained from database using getCurrentPlan or getNextPlan
 */
function transformPlanTS(plan) {
  plan.start = plan.start.seconds;
  plan.end = plan.end.seconds;

  return plan;
}

/**
 * Get users' subscription plan details
 * @function getPlan
 * @param {string} userID User ID, which is the user's email address
 */
async function getPlans(userID) {
  // Get data from DB
  const plansDoc = await db.collection("userPlans").doc(userID).get();
  const plans = plansDoc.data();

  // If the document does not exist, means user is using it for the first time
  if (!plans) return null;

  // Seperate count variable from plans values
  const count = plans.count;
  delete plans.count;

  // Generate current timestamp only once
  const nowTS = firebase.firestore.Timestamp.now().seconds;

  const currentPlan = getCurrentPlan(nowTS, plans, count);
  const nextPlan = getNextPlan(nowTS, plans, count);

  return {
    status: {
      normal: isNormal(currentPlan, nextPlan, count),
      cancelled: isCancelled(currentPlan, nextPlan, count),
      cancelling: isCancelling(currentPlan, nextPlan, count),
    },
    currentPlan: transformPlanTS(currentPlan),
    // Should nextPlanID only be included if it is different?
    // By default we should set nextPlanID to be the Same plan for next month since there is no other specified plan
    nextPlan: transformPlanTS(nextPlan),
  };
}

// When we pause it,
const pause = {
  status: {
    paused: true,
  },
  currentPlanID: "valid ID",
  nextPlanID: null, // Null to indicate next month onwards is paused
};
// When we cancel it, the current plan IF ANY should still be returned. However, we should add a note denoting CANCEL
const cancel = {
  status: {
    cancelled: true,
  },
  currentPlanID: "null",
  nextPlanID: null, // Null to indicate paused and no plans
};

/*
  @definitions
  plan ID null means it does not exist

  when we pause/cancel a class, how do we represent this information in the DB?
  
  NEW/CREATED === If there is no plans, AND count is 0
  // PAUSING === If there is a plan in this period, BUT the plan ENDS on the last day of this period
  //       and there is a future plan...
  // PAUSED === If there is NO plan this period, BUT there is a future plan that havent start.
*/

// // If latest plan has already started
// if (
//   plans[plans.count].start.seconds <=
//   firebase.firestore.Timestamp.now().seconds
// )
//   res.json({
//     success: true,
//     plans: {
//       currentPlanID: plans[plans.count].planID,
//       nextPlanID: plans[plans.count].planID, // Same plan for next month since there is no other specified plan
//     },
//   });
// // Else if still on second last plan for current plan period
// else if (
//   plans[plans.count - 1].end.seconds >
//   firebase.firestore.Timestamp.now().seconds
// )
//   res.json({
//     success: true,
//     plans: {
//       currentPlanID: plans[plans.count - 1].planID,
//       nextPlanID: plans[plans.count].planID,
//     },
//   });

// (async function () {
//   const plans = await getPlans("jj@enkeldigital.com");
//   console.log(plans);

//   console.log(JSON.parse(JSON.stringify(plans)));
// })();

module.exports = getPlans;
