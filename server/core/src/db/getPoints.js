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

async function getUserPoints(userID) {
  /*
    Find sub plan
    find total points of that sub plan
    Find out how much points is bought through topups
    minus all points spent via bookings
  */

  const nowTS = unixseconds();

  // @todo If user does not have a current plan, this function will not work. Thus to handle this
  // How this is handled depends on whether we allow users to have topup even when they do not have a plan.
  // If users can topup without a plan, then to we cant figure out current period without a current plan,
  // thus the solution is to use the purchaseTime to see if nowTS is within 30 days of the purchaseTime.
  const usersCurrentPlan = await getCurrentPlan(userID, nowTS);

  // Alternative for getting totalPoints if user does not have a plan
  // const { totalPoints } = usersCurrentPlan
  //   ? await SQLdb("subscriptionPlans")
  //       .where({ id: usersCurrentPlan.planID })
  //       .select("totalPoints")
  //       .first()
  //   : { totalPoints: 0 };

  const { totalPoints } = await SQLdb("subscriptionPlans")
    .where({ id: usersCurrentPlan.planID })
    .select("totalPoints")
    .first();

  const startOfCurrentPeriod = await getStartOfCurrentPeriod({
    usersCurrentPlan,
    nowTS,
  });
  const endOfCurrentPeriod = await getEndOfCurrentPeriod({
    usersCurrentPlan,
    nowTS,
  });

  const { pointsToppedUp = 0 } = await SQLdb("userTopups")
    .join("topupOptions", "userTopups.topupID", "=", "topupOptions.id")
    .where({ userID })
    .whereBetween("purchaseTime", [startOfCurrentPeriod, endOfCurrentPeriod]) // If purchaseTime between start and end of current period
    .sum("totalPoints as pointsToppedUp")
    .first(); // Use first as result returned is always an array

  const { pointsUsed = 0 } = await SQLdb("userBookingTransactions")
    .where({ userID })
    // @todo Might need a end date filter too,
    // This will be based on whether we allow user to book classes in the next period with their points from this period
    .andWhere("actionTime", ">=", startOfCurrentPeriod) // Where time of booking is after start of current period.
    .sum("points as pointsUsed")
    .first(); // Use first as result returned is always an array

  // pointsRefunded is not used in main "userBookingTransactions" table, and only used for analytics purposes
  //   const pointsRefunded = await SQLdb("userBookingTransactions")
  //     .where({ userID })
  //     .andWhere("actionTime", ">=", "") // pass in start of the user's period month in their TZ
  //     .andWhere({ cancelled: true });
  //     .select("points")
  //     .sum("points");

  // Calculate and return user points
  // All values are wrapped in parseInt as sum aggregate operations may return string as values from the DB
  return (
    parseInt(totalPoints) + parseInt(pointsToppedUp) - parseInt(pointsUsed)
  );
}

module.exports = { getUserPoints };
