const db = require("./../utils/db.js");

/**
 * get stripe price ID base on the plan id inn db
 * @param {*} planID Plan ID
 */
async function getPriceID(planID) {
  const subscriptionRef = db.collection("billingSubscriptions");

  const priceID = (await subscriptionRef.doc(planID).get()).data().priceID;

  if (!priceID) return console.log("No matching subscription.");

  return priceID;
}

module.exports = getPriceID;
