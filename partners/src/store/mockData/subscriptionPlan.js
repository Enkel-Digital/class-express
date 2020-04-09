/**
 * Export mock data from here for testing UI before backend is created
 */

const subscriptionPlans = [
  {
    id: 0,
    description: "Starter Pack",
    copywriting: "Hate being tied down?<br />Start simple and topup anytime!",
    totalPoints: 50,
    price: {
      value: 59,
      currency: "SGD"
    }
  },
  {
    id: 1,
    description: "Gold members",
    copywriting: "A Better deal, A Better you!",
    totalPoints: 100,
    price: {
      value: 89,
      currency: "SGD"
    }
  },
  {
    id: 2,
    description: "Platinum",
    copywriting:
      "Go platinum, or Go home.<br />Join platinum for exclusive in app deals!",
    totalPoints: 120,
    price: {
      value: 100,
      currency: "SGD"
    }
  }
];

module.exports = { subscriptionPlans };
