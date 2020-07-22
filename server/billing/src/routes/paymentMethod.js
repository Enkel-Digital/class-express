const express = require("express");
const router = express.Router();
const db = require("./../utils/db.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { getStripeCustomerId } = require("../db/getCustomer");

/**
 * Checks if payment method object exists for this userID
 * @name GET /user/paymentMethod/available/:userID
 * @function
 * @returns {object} payment method
 */
router.get("/available/:userID", async (req, res) => {
    try {
      const { userID } = req.params;
  
      const userAccountRef = db.collection("userAccount");
      const snapshot = await userAccountRef.doc(userID).get();
      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      }
  
      const customerID = snapshot.data().customerID;
  
      const listpaymentMethod = await stripe.paymentMethods.list({
        customer: customerID,
        type: "card",
      });
  
      return res.json({ success: true, data: listpaymentMethod });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });


/**
 * Create a new payment method
 * @name POST /paymentMethod/create
 * @function
 * @param {string} userAccountId  userAccount ID to set as doc ID in firestore
 * @param {string} type type of the payment method
 * @param {object} card card info including card number, expiration month,expiration year,cvc
 * @param {object} billingdetails name, email....
 * @returns {object} success indicator
 */
router.post("/create", express.json(), async (req, res) => {
  try {
    const { userAccountId, type, card, billingDetails } = req.body;

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

    const userAccountRef = db.collection("userAccount");
    const stripeCustomerId = await getStripeCustomerId(userAccountId);

    // updateCustomerDefaultPaymentMethod
    await stripe.customers.update(stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    });

    const res = await userAccountRef
      .doc(userAccountId)
      .update({ paymentMethodID: paymentMethod.id })

      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
        res.json({ success: true, docRefId: docRef.id });
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});



/**
 * Save a payment method ID in db
 * Update customer default payment method
 * @name POST /paymentMethod/save
 * @function
 * @param {string} userAccountId  userAccount ID to set as doc ID in firestore
 * @param {string} paymentMethodID paymentMethod ID
 * @returns {object} success indicator
 */
router.post("/save", express.json(), async (req, res) => {
  try {
    const { userAccountID, paymentMethodID } = req.body;

    const userAccountRef = db.collection("userAccount");
    const stripeCustomerId = await getStripeCustomerId(userAccountID);

    // updateCustomerDefaultPaymentMethod
    await stripe.customers.update(stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodID,
      },
    });

    const res = await userAccountRef
      .doc(userAccountID)
      .update({ paymentMethodID: paymentMethodID })

      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
        res.json({ success: true, docRefId: docRef.id });
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;