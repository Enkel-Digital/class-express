/**
 * Export mock data from here for testing UI before backend is created
 */

module.exports = {
  ...require("./bookings"),
  ...require("./subscriptionPlan"),
  ...require("./earningsHistory"),
};
