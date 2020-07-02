/**
 * Abstractions over SQL db for getting user's subscription plans.
 * @author JJ
 */

const SQLdb = require("@enkeldigital/ce-sql");
const unixseconds = require("unixseconds");

function getCurrentPlan(userID, nowTS = unixseconds()) {
  return SQLdb("userPlans")
    .where({ userID })
    .where("start", "<=", nowTS) // If already started. // Using <= instead of < as update can be done in the same second
    .where(function () {
      // And doesnt have a end date Or if the end date is past the current date
      this.whereNull("end").orWhere("end", ">", nowTS);
    })
    .first(); // Although always be 1, first is still used to get object form instead of a 1 element array
}

function getNextPlan(userID, nowTS = unixseconds()) {
  return SQLdb("userPlans")
    .where({ userID })
    .where("start", ">", nowTS) // Where plan has yet to start
    .first(); // Although always be 1, first is still used to get object form instead of a 1 element array
}

/**
 * @param {Number} [nowTS=unixseconds()] pass the same timestamp value for consistent filtering
 */
async function getPlans(userID, nowTS = unixseconds()) {
  return {
    // If none, undefined will be returned
    current: await getCurrentPlan(userID, nowTS),
    next: await getNextPlan(userID, nowTS),
  };
}

module.exports = {
  getCurrentPlan,
  getNextPlan,
  getPlans,
};
