/**
 * Export mock data from here for testing UI before backend is created
 */

const user = {
  name: "JJ Lee",
  email: "JJ@enkeldigital.com",
  picture: undefined,
  location: {
    country: "" // Used for the default search location
  }
};

const points = {
  left: 20,
  total: 45,
  pointsPeriod: {
    timezone: "",
    start: "",
    end: "20 / 4 / 2020" // To change to some other datetime format
  }
};

const paymentDetails = {
  userId: "",
  paymentProvider: "" // Enum of credit card or SaaS like paypal/stripe
};

module.exports = {
  user,
  points,
  paymentDetails,
  ...require("./exploreView"),
  ...require("./subscriptionPlan")
};
