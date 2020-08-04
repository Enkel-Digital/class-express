const express = require("express");
const router = express.Router();
const db = require("./../utils/db.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/**
 * Checks if customer object exists for this userID
 * @name GET /user/exists/:userID
 * @returns {object} Boolean
 */
router.get("/exists/:userID", async (req, res) => {
  try {
    const { userID } = req.params;
    const user = (
      await db.collection("billingCustomerAccounts").doc(userID).get()
    ).data();

    return res.status(200).json({ success: true, exists: Boolean(user) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Create a new customer
 * @name POST /user/create
 * @param {string} userAccountID  userAccount ID to set as doc ID in firestore
 * @param {object} userDetails Details of the user, used to create the stripe customer object
 * @returns {object} Boolean
 */
router.post("/create", express.json(), async (req, res) => {
  try {
    const { userAccountID, userDetails } = req.body;

    const customer = await stripe.customers.create(userDetails);

    console.log("create", userAccountID);

    // save stripe's customer.id as customerID in db
    await db
      .collection("billingCustomerAccounts")
      .doc(userAccountID.toString()) // As userAccountID is a number, WE MUST CONVERT it to string first, as firestore NEEDS string for document path!!!
      .set({ customerID: customer.id });

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
