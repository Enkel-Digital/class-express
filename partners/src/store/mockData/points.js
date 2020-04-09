/**
 * Export mock data from here for testing UI before backend is created
 */

const moment = require("moment");

const points = {
  left: 20,
  total: 45,
  period: {
    timezone: "",
    // Timestamps
    // Each period is 30 days long
    start: moment()
      .subtract(20, "days")
      .unix(), // 20 days before
    end: moment()
      .add(10, "days")
      .unix() // 10 days from now
  }
};

const topupOptions = [
  {
    id: 0,
    description: "Missing a few points 😫",
    copywriting:
      "For you when you are just missing a few points for a class before the month ends",
    totalPoints: 5,
    price: {
      value: 10,
      currency: "SGD"
    }
  },
  {
    id: 1,
    description: "Cheap cheap 😁",
    copywriting: "A Cheap cheap deal to give you more!",
    totalPoints: 15,
    price: {
      value: 27,
      currency: "SGD"
    }
  },
  {
    id: 2,
    description: "Huat ah 🤙🏻",
    copywriting:
      "Seems like your plan wasn't enough, remember to upgrade your plan next month for a better deal! 😁",
    totalPoints: 30,
    price: {
      value: 50,
      currency: "SGD"
    }
  }
];

module.exports = { points, topupOptions };
