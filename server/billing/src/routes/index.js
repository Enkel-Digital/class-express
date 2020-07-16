/** @notice Parent router where all other routers are mounted onto. */
const express = require("express");
const router = express.Router();
const db = require("./../utils/db.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const auth = require("../middleware/auth");
const { response } = require("express");

// Mount all the routes onto their respective base routes
router.use("/", require("./default"));

/**
 * Checks if customer object exists for this userID
 * @name GET /user/exists/:userID
 * @function
 * @returns {object} customer ID and paymethod ID
 */
router.get("/user/exists/:userID", async (req, res) => {
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
 * Checks if payment method object exists for this userID
 * @name GET /user/paymentMethod/available/:userID
 * @function
 * @returns {object} payment method
 */
router.get("/user/paymentMethod/available/:userID", async (req, res) => {
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
 * Create a new customer
 * @name POST /user/create/customer
 * @function
 * @param {object} userDetails
 * @param {string} userAccountI  userAccount ID to set as doc ID in firestore
 * @returns {object} success indicator with customer object and doc reference ID
 */
router.post("/user/create/customer", express.json(), async (req, res) => {
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

/**
 * Create a new payment method
 * @name POST /user/create/paymentMethod
 * @function
 * @param {string} userAccountId  userAccount ID to set as doc ID in firestore
 * @param {string} type type of the payment method
 * @param {object} card card info including card number, expiration month,expiration year,cvc
 * @param {object} billingdetails name, email....
 * @returns {object} success indicator
 */
router.post("/user/create/paymentMethod", express.json(), async (req, res) => {
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
 * @name POST /user/create/paymentMethod
 * @function
 * @param {string} userAccountId  userAccount ID to set as doc ID in firestore
 * @param {string} paymentMethodID paymentMethod ID
 * @returns {object} success indicator
 */
router.post("/user/save/paymentMethod", express.json(), async (req, res) => {
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

router.post("/plans/update/:planId", express.json(), async (req, res) => {
  try {
    const { planId } = req.params;
    const { userAccountId } = req.body;
    const stripeCustomerId = await getStripeCustomerId(userAccountId);
    const priceId = await getPriceId(planId);

    const testCustomerID = "cus_HcIjLOcL3Fo4Go";

    // get the current subscription plan
    const currentSubscriptionPlan = await stripe.subscriptions.list({
      customer: testCustomerID,
      status: "active",
    });

    // get Subscription Schedule
    const currentSubscriptionSchedule = await stripe.subscriptionSchedules.list(
      { customer: testCustomerID, scheduled: true }
    );

    // if got future scheduled plans
    // cancel them
    if (currentSubscriptionSchedule.data.length) {
      currentSubscriptionSchedule.data.forEach((schedule) => {
        stripe.subscriptionSchedules.cancel(schedule.id, function (
          err,
          subscriptionSchedule
        ) {
          if (err) {
            console.log(err);
          }
        });
      });
    }

    // if the user is new registered customer
    if (currentSubscriptionPlan.data.length === 0) {
      const newSubscription = await stripe.subscriptions.create({
        customer: testCustomerID,
        items: [{ price: priceId }],
      });
      res.json({ success: true, subscription: newSubscription });
    }

    const currentSubscriptionID = currentSubscriptionPlan.data[0].id;

    // cancel the subscription at the end of the current billing period
    const endOfCurrentPeriod = await stripe.subscriptions.update(
      currentSubscriptionID,
      { cancel_at_period_end: true }
    );

    const endDate = endOfCurrentPeriod.current_period_end;

    // create new subscription start at the day after the previous subscription end
    // const newSubscription = await stripe.subscriptions.create({
    //   customer: testCustomerID,
    //   items: [{ price: priceId }],

    // });

    // const schedule = await stripe.subscriptionSchedules.create({
    //   from_subscription: newSubscription.id,
    // });

    const updateSchedule = await stripe.subscriptionSchedules.create({
      customer: testCustomerID,
      start_date: endDate,
      end_behavior: "release",
      phases: [
        {
          plans: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          iterations: 1,
        },
      ],
    });

    res.json({
      success: true,
      updateSubscription: updateSchedule,
      currentSubscriptionPlan: currentSubscriptionPlan,
      schedule: currentSubscriptionSchedule,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

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
module.exports = router;
