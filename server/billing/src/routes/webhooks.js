const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Webhook handler for asynchronous events.
router.post(
  "/",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        // verify that the events were sent by Stripe
        req.headers["stripe-signature"],
        // for test only: webhook signing secret using stripe CLI
        // for production: use endpoint's secret in webhook settings in the Developer Dashboard
        "whsec_RTDcgLzJAaNjRzbv2iqU3dCoZ8MQtbAC"
      );
    } catch (err) {
      console.error(err);
      console.error(`Webhook signature verification failed.`);
      console.error(`Check the env file and enter the correct webhook secret.`);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    const dataObject = event.data.object;

    // Handle the event
    switch (event.type) {
      case "invoice.paid":
        // Used to provision services after the trial has ended.
        // The status of the invoice will show up as paid. Store the status in your
        // database to reference when a user accesses your service to avoid hitting rate limits.
        console.log("succeeded");
        break;
      case "invoice.payment_failed":
        // If the payment fails or the customer does not have a valid payment method,
        //  an invoice.payment_failed event is sent, the subscription becomes past_due.
        // Use this webhook to notify your user that their payment has
        // failed and to retrieve new card details.
        console.log("invoice.payment_failed");
        break;
      case "invoice.finalized":
        // If you want to manually send out invoices to your customers
        // or store them locally to reference to avoid hitting Stripe rate limits.
        break;
      case "customer.subscription.deleted":
        if (event.request != null) {
          // handle a subscription cancelled by your request
          // from above.
        } else {
          // handle subscription cancelled automatically based
          // upon your subscription settings.
        }
        break;
      case "customer.subscription.trial_will_end":
        // Send notification to your user that the trial will end
        break;
      default:
      // Unexpected event type
    }

    // To acknowledge receipt of an event, your endpoint must return a 2xx HTTP status code to Stripe.
    res.sendStatus(200);
  }
);

module.exports = router;
