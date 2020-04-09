/**
 * Export mock data from here for testing UI before backend is created
 */

const user = {
  name: "JJ Lee",
  email: "JJ@enkeldigital.com",
  imageSrc: "https://avatars2.githubusercontent.com/u/44993072?s=460",
  location: {
    country: "" // Used for the default search location
  }
};

const paymentDetails = {
  userId: "",
  paymentProvider: "" // Enum of credit card or SaaS like paypal/stripe
};

module.exports = {
  user,
  paymentDetails,
  ...require("./points"),
  ...require("./classes"),
  ...require("./subscriptionPlan"),
  ...require("./news")
};
