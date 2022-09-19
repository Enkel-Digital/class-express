/**
 * Abstractions over SQL db for getting user's points for the current period
 * @author JJ
 */

const SQLdb = require("@enkeldigital/ce-sql");
const unixseconds = require("unixseconds");
const { getCurrentPlan } = require("./getPlans");
const {
  getStartOfCurrentPeriod,
  getEndOfCurrentPeriod,
} = require("../db/currentPeriodTimestamps");

/**
 * Get user's points from this current period's subscription plan
 * @param {*} usersCurrentPlan
 * @returns {Number} totalPointsFromCurrentSubscriptionPlan as a number
 */
async function getPointsFromCurrentSubscriptionPlan(usersCurrentPlan) {
  return parseInt(
    (
      await SQLdb("subscriptionPlans")
        .where({ id: usersCurrentPlan.planID })
        .select("totalPoints")
        // Use first as result returned is always an array
        .first()
    ).totalPoints || 0
  );
}

/**
 * Get total amount of points user topped up in this period
 * @param {*} userID
 * @param {*} startOfCurrentPeriod
 * @param {*} endOfCurrentPeriod
 * @returns {Number} pointsToppedUp as a number
 */
async function getPointsToppedUp(
  userID,
  startOfCurrentPeriod,
  endOfCurrentPeriod
) {
  return parseInt(
    (
      await SQLdb("userTopups")
        .join("topupOptions", "userTopups.topupID", "=", "topupOptions.id")
        .where({ userID })
        // If purchaseTime between start and end of current period
        .whereBetween("purchaseTime", [
          startOfCurrentPeriod,
          endOfCurrentPeriod,
        ])
        .sum("totalPoints as pointsToppedUp")
        // Use first as result returned is always an array
        .first()
    ).pointsToppedUp || 0
  );
}

/**
 * Get the user's total point for the user's current period.
 * This includes points from subscription plan and topups.
 * @param {*} userID
 * @param {*} usersCurrentPlan
 * @param {*} startOfCurrentPeriod
 * @param {*} endOfCurrentPeriod
 * @returns {Number} totalPointsForCurrentPeriod as a number
 */
async function getTotalPointsForCurrentPeriod(
  userID,
  usersCurrentPlan,
  startOfCurrentPeriod,
  endOfCurrentPeriod
) {
  // Get user's points from this current period's subscription plan
  const pointsFromSubscriptionPlan = await getPointsFromCurrentSubscriptionPlan(
    usersCurrentPlan
  );

  const pointsToppedUp = await getPointsToppedUp(
    userID,
    startOfCurrentPeriod,
    endOfCurrentPeriod
  );

  return pointsFromSubscriptionPlan + pointsToppedUp;
}

/**
 * Get total amount of points user topped up in this period
 * @param {*} userID
 * @param {*} startOfCurrentPeriod
 * @param {*} endOfCurrentPeriod
 * @returns {Number} pointsUsed as a number
 */
async function getPointsUsed(userID, startOfCurrentPeriod, endOfCurrentPeriod) {
  return parseInt(
    (
      await SQLdb("userBookingTransactions")
        .where({ userID })
        // @todo Might need a end date filter too,
        // This will be based on whether we allow user to book classes in the next period with their points from this period
        .andWhere("actionTime", ">=", startOfCurrentPeriod) // Where time of booking is after start of current period.
        .sum("points as pointsUsed") // Use first as result returned is always an array
        .first()
    ).pointsUsed || 0
  );
}

/**
 * Get points object for user's current period
 * @param {*} userID
 * @returns {Object} user's point object for the current period
 */
async function getUserPoints(userID) {
  /*
    Find sub plan
    find total points of that sub plan
    Find out how much points is bought through topups
    minus all points spent via bookings
  */

  const nowTS = unixseconds();

  const usersCurrentPlan = await getCurrentPlan(userID, nowTS);

  // If user does not have a current plan, return undefined to show nothing
  /* 
  How this is handled depends on whether we allow users to have topup even when they do not have a plan.
  If users can topup without a plan, then to we cant figure out current period without a current plan,
  thus the solution is to use the purchaseTime to see if nowTS is within 30 days of the purchaseTime.
  
    This might cause an issue if user have a cancelled plan.
  */
  if (!usersCurrentPlan) return;

  const startOfCurrentPeriod = await getStartOfCurrentPeriod({
    usersCurrentPlan,
    nowTS,
  });
  const endOfCurrentPeriod = await getEndOfCurrentPeriod({
    usersCurrentPlan,
    nowTS,
  });

  const totalPoints = await getTotalPointsForCurrentPeriod(
    userID,
    usersCurrentPlan,
    startOfCurrentPeriod,
    endOfCurrentPeriod
  );

  const pointsUsed = await getPointsUsed(
    userID,
    startOfCurrentPeriod,
    endOfCurrentPeriod
  );

  // pointsRefunded is not used in main "userBookingTransactions" table, and only used for analytics purposes
  //   const pointsRefunded = await SQLdb("userBookingTransactions")
  //     .where({ userID })
  //     .andWhere("actionTime", ">=", "") // pass in start of the user's period month in their TZ
  //     .andWhere({ cancelled: true });
  //     .select("points")
  //     .sum("points");

  return {
    left: totalPoints - pointsUsed,
    total: totalPoints,
    period: {
      // @todo Fix this, for now, defaults to SG time
      timezone: "SGT",
      start: startOfCurrentPeriod,
      end: endOfCurrentPeriod,
    },
  };
}

module.exports = {
  getUserPoints,
  getPointsFromCurrentSubscriptionPlan,
  getPointsToppedUp,
  getTotalPointsForCurrentPeriod,
  getPointsUsed,
};
