/**
 * Export mock data from here for testing UI before backend is created
 */
module.exports = {
  ...require("./points"),
  ...require("./classes"),
  ...require("./subscriptionPlan"),
  ...require("./news"),
};
