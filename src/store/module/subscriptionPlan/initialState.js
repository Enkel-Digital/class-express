/**
 * Initial State applied into vuex module
 * Wrapped in function to prevent shallow copying state modification with object references
 */
export default function initialState() {
  return {
    currentPlanID: undefined,
    nextPlanID: undefined,
    subscriptionPlans: []
  };
}

/**
 * Example/Reference on how a subscriptionPlans element would be
 */
const subscriptionPlanElementReference = {
  id: 0,
  description: "Starter Pack",
  copywriting: "Hate being tied down?<br />Start simple and topup anytime!",
  totalPoints: 50,
  price: {
    value: 59,
    currency: "SGD"
  }
};
