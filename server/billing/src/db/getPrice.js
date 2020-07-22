const db = require("./../utils/db.js");

// get stripe price ID base on the plan id inn db
async function getPriceId(planId) {
  const subscriptionRef = db.collection("subscription");

  const snapshot = await subscriptionRef.doc(planId).get();
  if (snapshot.empty) {
    console.log("No matching subscription.");
    return;
  }
  const priceId = snapshot.data().priceID;

  return priceId;
}

module.exports = getPriceId;
