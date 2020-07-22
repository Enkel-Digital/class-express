const express = require("express");
const router = express.Router();
const db = require("./../utils/db.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/**
 * Checks if customer object exists for this userID
 * @name GET /user/exists/:userID
 * @function
 * @returns {object} customer ID and paymethod ID
 */
router.get("/exists/:userID", async (req, res) => {
  try {
    const { userID } = req.params;

    const userAccountRef = db.collection("userAccount");
    const snapshot = await userAccountRef.doc(userID).get();
    if (snapshot.empty) {
      console.log("No matching documents.");
      return;
    }
    console.log(snapshot.id, "=>", snapshot.data());

    return res.json({ success: true, data: snapshot.data() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Create a new customer
 * @name POST /user/create/customer
 * @function
 * @param {object} userDetails
 * @param {string} userAccountI  userAccount ID to set as doc ID in firestore
 * @returns {object} success indicator with customer object and doc reference ID
 */
router.post("/create/customer", express.json(), async (req, res) => {
  try {
    const { userDetails, userAccountId } = req.body;

    const customer = await stripe.customers.create({
      email: userDetails.email,
      name: userDetails.name,
    });

    // save the customer.id as stripe CustomerId in db
    db.collection("userAccount")
      .doc(userAccountId)
      .set({
        customerID: customer.id,
      })
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
        res.json({ success: true, docRefId: docRef.id, customer });
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
