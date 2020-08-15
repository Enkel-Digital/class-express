/**
 * Export mock data from here for testing UI before backend is created
 */

const paymentDetails = {
  userId: "",
  paymentProvider: "", // Enum of credit card or SaaS like paypal/stripe
};

module.exports = {
  paymentDetails,
  ...require("./points"),
  ...require("./bookings"),
  ...require("./classes"),
  ...require("./subscriptionPlan"),
  ...require("./news"),
  ...require("./earningsHistory"),
};
