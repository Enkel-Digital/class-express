/**
 * DB abstraction to create initial blank user plan in firestore
 * @author JJ
 * @module initialUserPlan
 */

const db = require("../src/utils/db");

const defaultUserPlanDocument = {
  // Set count (number of plans) to 0 to indicate new user with no plans yet
  count: 0,
};

/**
 * Create default initial user's subscription plan document
 * @function getPlan
 * @param {string} userID User ID, which is the user's email address
 */
async function initializeUserPlan(userID) {
  // Create document with user's email and default plans object
  return db.collection("userPlans").doc(userID).set(defaultUserPlanDocument);
}

module.exports = initializeUserPlan;
