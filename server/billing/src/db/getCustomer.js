const db = require("./../utils/db.js");

// get stripe customer id base on customer account id in db
async function getStripeCustomerId(userAccountId) {
    const userAccountRef = db.collection("userAccount");
  
    const snapshot = await userAccountRef.doc(userAccountId).get();
    if (snapshot.empty) {
      console.log("No matching documents.");
      return;
    }
    const stripeCustomerId = snapshot.data().customerID;
  
    return stripeCustomerId;
  }
  

  module.exports=getStripeCustomerId