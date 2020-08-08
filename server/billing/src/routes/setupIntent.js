const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const getStripeCustomerID = require("../db/getCustomer");

/**
 * get client secret when creating setupIntent
 * @name GET /setupIntent/card-wallet/:userAccountID
 * @returns {object} success indicator with SetupIntent client_secret
 *
 * @todo to protect this route
 */
router.get("/card-wallet/:userAccountID", async (req, res) => {
  try {
    const { userAccountID } = req.params;
    const stripeCustomerID = await getStripeCustomerID(userAccountID);

    const intent = await stripe.setupIntents.create({
      customer: stripeCustomerID,
    });

    res
      .status(201)
      .json({ success: true, client_secret: intent.client_secret });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
