const express = require("express");
const router = express.Router();
const db = require("./../utils/db.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { getStripeCustomerID } = require("../db/getCustomer");
const { getPriceID } = require("../db/getPrice");

router.post("/update/:planId", express.json(), async (req, res) => {
  try {
    const { planId } = req.params;
    const { userAccountId } = req.body;
    const stripeCustomerId = await getStripeCustomerID(userAccountId);
    const priceID = await getPriceID(planId);

    // @todo Remove
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
      // @todo Potential buggy code, where the cancel methods are async using callbacks and no garuntee of completions before moving on
      currentSubscriptionSchedule.data.forEach((schedule) => {
        stripe.subscriptionSchedules.cancel(schedule.id, function (
          err,
          subscriptionSchedule
        ) {
          // @todo Handle the errors better here instead of just logging
          if (err) console.error(err);
        });
      });
    }

    // if the user is new registered customer
    // @todo What does number 0 even mean?
    if (currentSubscriptionPlan.data.length === 0) {
      const newSubscription = await stripe.subscriptions.create({
        customer: testCustomerID,
        items: [{ price: priceID }],
      });
      // @todo Should the function end here or continue?
      res.json({ success: true, subscription: newSubscription });
    }

    // @todo Is array the best option here?
    const currentSubscriptionID = currentSubscriptionPlan.data[0].id;

    // cancel the subscription at the end of the current billing period
    const endOfCurrentPeriod = await stripe.subscriptions.update(
      currentSubscriptionID,
      { cancel_at_period_end: true }
    );

    const endDate = endOfCurrentPeriod.current_period_end;

    // @todo Are these still needed
    // create new subscription start at the day after the previous subscription end
    // const newSubscription = await stripe.subscriptions.create({
    //   customer: testCustomerID,
    //   items: [{ price: priceID }],

    // });

    // const schedule = await stripe.subscriptionSchedules.create({
    //   from_subscription: newSubscription.id,
    // });

    const updateSchedule = await stripe.subscriptionSchedules.create({
      // @todo To remove test customer ID
      customer: testCustomerID,
      start_date: endDate,
      end_behavior: "release",
      phases: [
        {
          plans: [
            {
              price: priceID,
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

module.exports = router;
