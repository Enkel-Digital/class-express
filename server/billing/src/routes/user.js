const express = require("express");
const router = express.Router();
const db = require("./../utils/db.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function customerExists(userID) {
  return Boolean(
    (
      await db
        .collection("billingCustomerAccounts")
        .doc(userID.toString()) // As userAccountID is a number, WE MUST CONVERT it to string first, as firestore NEEDS string for document path!!!
        .get()
    ).data()
  );
}

/**
 * Checks if customer object exists for this userID
 * @name GET /user/exists/:userID
 * @returns {object} Boolean
 */
router.get("/exists/:userID", async (req, res) => {
  try {
    const { userID } = req.params;

    return res
      .status(200)
      .json({ success: true, exists: await customerExists(userID) });
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

    if (await customerExists(userAccountID))
      res
        .status(200) // Use 200 code to indicate no error, as technically the user already exists and is "created"
        .json({
          success: true,
          message: "Duplicate user account. Creation skipped.",
        });

    const customer = await stripe.customers.create(userDetails);

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
