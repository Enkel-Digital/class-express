const db = require("./../utils/db.js");

// Get stripe customer ID using user's account ID from DB
async function getStripeCustomerID(userAccountID) {
  const snapshot = await db
    .collection("billingCustomerAccounts")
    .doc(userAccountID)
    .get();

  if (snapshot.empty) return;

  return snapshot.data().customerID;
}

module.exports = getStripeCustomerID;
