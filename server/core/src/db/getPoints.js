/**
 * Abstractions over SQL db for getting user's points of the current period
 * @author JJ
 */

const moment = require("moment");
const SQLdb = require("@enkeldigital/ce-sql");
const unixseconds = require("unixseconds");
const { getCurrentPlan } = require("./getPlans");

async function getUserPoints(userID) {
  /*
    Find sub plan
    find total points of that sub plan
    Find out how much points is bought through topups
    minus all points spent via bookings
  */

  const nowTS = unixseconds();

  const usersCurrentPlan = await getCurrentPlan(userID, nowTS);
  const { planID } = usersCurrentPlan; // @todo cannot destructure if undefined

  const { totalPoints } = await SQLdb("subscriptionPlans")
    .where({ id: planID })
    .select("totalPoints")
    .first();

  const { points_bought: pointsToppedUp } = await SQLdb("userPurchases")
    .where({ userID })
    .andWhere("purchaseTime", ">=", "user time")
    .select("points_bought")
    .first();

  // 30 Days in seconds
  const periodLengthInSeconds = 30 * 24 * 60 * 60; // 30 days, 24 hours, 60 mins, 60 seconds

  // Calculate total number of periods excluding current period, to get timestamp of the start of current period
  const startOfCurrentPeriod = moment
    .unix(usersCurrentPlan.start)
    .add(
      Math.floor((nowTS - usersCurrentPlan.start) / periodLengthInSeconds) * 30,
      "days"
    )
    .unix();

  const pointsUsed = await SQLdb("userBookingTransactions")
    .where({ userID })
    .andWhere("actionTime", ">=", startOfCurrentPeriod) // pass in start of the user's period month in their TZ
    .select("points")
    .sum("points");

  // pointsRefunded is not used in main "userBookingTransactions" table, and only used for analytics purposes
  //   const pointsRefunded = await SQLdb("userBookingTransactions")
  //     .where({ userID })
  //     .andWhere("actionTime", ">=", "") // pass in start of the user's period month in their TZ
  //     .andWhere({ cancelled: true });
  //     .select("points")
  //     .sum("points");

  // Calculate and return user points
  return totalPoints + pointsToppedUp - pointsUsed;
}

module.exports = { getUserPoints };
