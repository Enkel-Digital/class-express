const express = require("express");
const router = express.Router();
const db = require("./../utils/db.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { getStripeCustomerID } = require("../db/getCustomer");

/**
 * Checks if payment method object exists for this userID
 * @name GET /paymentMethod/available/:userID
 * @returns {object} Boolean
 */
router.get("/available/:userID", async (req, res) => {
  try {
    const { userID } = req.params;

    const user = (
      await db.collection("billingCustomerAccounts").doc(userID).get()
    ).data();
    if (!user)
      return res
        .status(404)
        .json({ success: false, error: "User does not exist" });

    const usersPaymentMethods = await stripe.paymentMethods.list({
      customer: user.customerID,
      type: "card",
    });

    res.json({ success: true, available: Boolean(usersPaymentMethods) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Create new payment method
 * @name POST /paymentMethod/create
 * @param {string} userAccountID  userAccount ID to set as doc ID in firestore
 * @param {string} type type of the payment method
 * @param {object} card card info including card number, expiration month,expiration year,cvc
 * @param {object} billingdetails name, email....
 * @returns {object} success indicator
 */
router.post("/create", express.json(), async (req, res) => {
  try {
    const { userAccountID, type, card, billingDetails } = req.body;

    const paymentMethod = await stripe.paymentMethods.create({
      type: type,
      card: {
        number: card.number,
        exp_month: card.exp_month,
        exp_year: card.exp_year,
        cvc: card.cvc,
      },
      billing_details: {
        email: billingDetails.email,
        name: billingDetails.name,
      },
    });

    const stripeCustomerID = await getStripeCustomerID(userAccountID);

    // updateCustomerDefaultPaymentMethod
    await stripe.customers.update(stripeCustomerID, {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    });

    await db
      .collection("billingCustomerAccounts")
      .doc(userAccountID)
      .update({ paymentMethodID: paymentMethod.id });

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @todo Fix and test this, user should send over a new payment Method instead of just a payment ID?
 *
 * Update customer's default payment method
 * @name PATCH /paymentMethod/:
 * @param {string} userAccountID  userAccount ID to set as doc ID in firestore
 * @param {string} paymentMethodID paymentMethod ID
 * @returns {object} success indicator
 */
router.patch("/save", express.json(), async (req, res) => {
  try {
    const { userAccountID, paymentMethodID } = req.body;

    const stripeCustomerID = await getStripeCustomerID(userAccountID);

    // updateCustomerDefaultPaymentMethod
    await stripe.customers.update(stripeCustomerID, {
      invoice_settings: {
        default_payment_method: paymentMethodID,
      },
    });

    await db
      .collection("billingCustomerAccounts")
      .doc(userAccountID)
      .update({ paymentMethodID: paymentMethodID });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
