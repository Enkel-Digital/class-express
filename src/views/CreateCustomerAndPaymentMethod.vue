<template>
  <v-main id="create-payment-method">
    <v-app-bar app flat color="white">
      <v-toolbar-title style="font-weight: bold;">
        Create New Payment Method
      </v-toolbar-title>
    </v-app-bar>

    <v-card
      class="mx-auto"
      max-width="calc(100% - 3em)"
      style="padding: 1em; border: 1px solid #e6e5e5;"
    >
      <ul>
        <li>
          You do not have a payment method currently.
        </li>

        <li>
          Please create a new payment method before any purchases can be made.
        </li>

        <li>
          Note that all future purchases in App will utilize this payment method
          until you cancel this or choose to change your payment method.
        </li>
      </ul>
    </v-card>

    <br />

    <v-card
      class="mx-auto"
      max-width="calc(100% - 3em)"
      style="padding: 1em; border: 1px solid #e6e5e5;"
    >
      <v-card-text>
        <h2>
          New Payment Method
        </h2>

        <br />

        <div class="error red center-align white-text">
          {{ stripeValidationError }}
        </div>
        <div class="card-element">
          <form id="setup-form" data-secret="client_secret">
            <div id="card-element"></div>
          </form>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn
          text
          class="col"
          color="deep-purple"
          @click="createPaymentMethod"
        >
          create payment method
        </v-btn>
      </v-card-actions>
    </v-card>

    <br />
  </v-main>
</template>

<script>
import { loadStripe } from "@stripe/stripe-js";
import { api } from "@/utils/billing";
import apiError from "@/store/utils/apiError";

export default {
  // "redirectObject" Is any valid object for router.replace(redirectObject). Ref to https://router.vuejs.org/guide/essentials/navigation.html#router-replace-location-oncomplete-onabort
  props: [
    "redirectObject",
    "shouldCreateCustomer",
    "shouldCreatePaymentMethod",
  ],

  created() {
    (async () => {
      this.stripe = await loadStripe(
        process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY
      );

      // Load stripe object first as we need stripe object to create customer
      if (this.shouldCreateCustomer)
        this.createCustomer().then(this.getSetupIntentClientSecret);
      else this.getSetupIntentClientSecret();

      this.createAndMountFormElement();
    })();
  },

  data() {
    return {
      stripe: null,
      cardElement: null,
      client_secret: null,

      // @todo Change these hard coded values
      customerId: "cus_HluwbIn7YkMRgf",
      billingName: "Tester",
      priceId: "plan_HEDADPvhVD1zls",

      // Registering on the component first before using
      stripeValidationError: undefined,
    };
  },

  methods: {
    // Creates billing customer with billing service using user details in vuex store
    // Needs stripe object to be loaded first
    async createCustomer() {
      try {
        const { id, email, firstName, lastName } = this.$store.state.user;

        const response = await api.post("/user/create", {
          userAccountID: id,
          // User details object MUST follow stripe customer object. Ref: https://stripe.com/docs/api/customers/create
          userDetails: {
            email,
            name: `${firstName} ${lastName || ""}`, // Prevent saving null last names
          },
        });

        if (!response.success) return apiError(response, this.createCustomer);
      } catch (error) {
        apiError(
          error.message,
          this.createCustomer,
          "Failed to create Stripe billing customer instance"
        );
      }
    },

    createAndMountFormElement() {
      const elements = this.stripe.elements();

      this.cardElement = elements.create("card");
      this.cardElement.mount("#card-element");

      // @todo Maybe dont do it like this? Only check / validate once the user press the button?
      this.cardElement.on("change", this.validateCardOnChange);
    },

    validateCardOnChange(event) {
      this.stripeValidationError = event.error ? event.error.message : "";

      if (this.stripeValidationError) {
        // Create new user error and show with ErrorDialog
        const userError = this.$error.createError(
          this.$error.ERROR.level.RETRY,
          this.$error.ERROR.custom("Invalid input", this.stripeValidationError)
        );
        this.$error.new(userError);
      }
    },

    // create payment method in frontend
    // then send the payment method to billing service
    async createPaymentMethod() {
      const cardElement = this.cardNumberElement;
      const priceId = this.priceId;
      const customerId = this.customerID;

      const result = await this.stripe.createPaymentMethod({
        type: "card",
        card: this.cardElement,
        billing_details: {
          name: this.billingName,
        },
      });

      // @todo Update this to use errorDialog and allow user to retry
      if (result.error) return this.displayError(result.error);
      else {
        // to create setupIntent
        this.createSetupIntent(result.paymentMethod.id);
      }
    },

    // create setupIntent in frontend
    // stripe.confirmCardSetup may take several seconds to complete.
    // During that time, disable form from being resubmitted
    // and show a waiting indicator.
    // this may reigger 3D secure authentication
    // walks them through check flow.
    async createSetupIntent(paymentMethodID) {
      const { setupIntent, error } = await this.stripe.confirmCardSetup(
        this.client_secret,
        {
          payment_method: paymentMethodID,
          // return_url:
          // If handling next actions by ourselves, pass in a return_url.
          // If the subsequent action is redirect_to_url, this URL will be used on the return path for the redirect.
          // https://stripe.com/docs/payments/payment-intents/verifying-status#next-actions
        }
      );

      if (error) {
        this.displayError(error);
      } else {
        if (setupIntent.status === "succeeded") {
          // Do not need to save into billing service as billing service can retrieve payment method via customer ID
          // Redirect user back to the view that requested for a payment method creation or a custom location
          if (this.redirectObject) this.$router.replace(this.redirectObject);
          else this.$router.go(-1);
        }
      }
    },

    // get setupIntent client secret
    async getSetupIntentClientSecret() {
      try {
        const { id } = this.$store.state.user;

        const response = await api.get(`/setupIntent/card-wallet/${id}`, {
          userAccountID: id,
        });
        if (!response.success) return apiError(response, this.createCustomer);

        this.client_secret = response.client_secret;
      } catch (error) {
        apiError(
          error.message,
          this.getSetupIntentClientSecret,
          "Failed to get SetupIntent Client Secret"
        );
      }
    },

    createSubscription({ customerId, paymentMethodId, priceId }) {
      return (
        api
          .post("/create-subscription", {
            customerId: customerId,
            paymentMethodId: paymentMethodId,
            priceId: priceId,
          })
          .then((response) => response.json())
          // If the card is declined, display an error to the user.
          .then((result) => {
            if (result.error) {
              // The card had an error when trying to attach it to a customer
              console.log(result.error);
              throw result;
            }
            return result;
          })
          // Normalize the result to contain the object returned
          // by Stripe. Add the addional details we need.
          .then((result) => {
            return {
              // Use the Stripe 'object' property on the
              // returned result to understand what object is returned.
              subscription: result,
              paymentMethodId: paymentMethodId,
              priceId: priceId,
            };
          })
          // Some payment methods require a customer to do additional
          // authentication with their financial institution.
          // Eg: 2FA for cards.
          .then(this.handleCustomerActionRequired)
          // If attaching this card to a Customer object succeeds,
          // but attempts to charge the customer fail. You will
          // get a requires_payment_method error.
          .then(this.handlePaymentMethodRequired)
          // No more actions required. Provision your service for the user.
          .then(this.onSubscriptionComplete)
          .catch((error) => {
            // An error has happened. Display the failure to the user here.
            // We utilize the HTML element we created.
            this.displayError(error);
          })
      );
    },

    handleCustomerActionRequired({
      subscription,
      invoice,
      priceId,
      paymentMethodId,
      isRetry,
    }) {
      // subscription is active, no customer actions required.
      if (subscription && subscription.status === "active")
        return { subscription, priceId, paymentMethodId };

      // If it's a first payment attempt, the payment intent is on the subscription latest invoice.
      // If it's a retry, the payment intent will be on the invoice itself.
      let paymentIntent = invoice
        ? invoice.payment_intent
        : subscription.latest_invoice.payment_intent;

      if (
        paymentIntent.status === "requires_action" ||
        (isRetry === true && paymentIntent.status === "requires_payment_method")
      )
        return this.stripe
          .confirmCardPayment(paymentIntent.client_secret, {
            payment_method: paymentMethodId,
          })
          .then((result) => {
            if (result.error) {
              // start code flow to handle updating the payment details
              // Display error message in your UI.
              // The card was declined (i.e. insufficient funds, card has expired, etc)
              throw result;
            } else {
              if (result.paymentIntent.status === "succeeded") {
                // There's a risk of the customer closing the window before callback
                // execution. To handle this case, set up a webhook endpoint and
                // listen to invoice.paid. This webhook endpoint returns an Invoice.
                return {
                  priceId: priceId,
                  subscription: subscription,
                  invoice: invoice,
                  paymentMethodId: paymentMethodId,
                };
              }
            }
          });
      // No customer action needed
      else return { subscription, priceId, paymentMethodId };
    },

    handlePaymentMethodRequired({ subscription, paymentMethodId, priceId }) {
      // subscription is active, no customer actions required.
      if (subscription.status === "active")
        return { subscription, priceId, paymentMethodId };
      else if (
        subscription.latest_invoice.payment_intent.status ===
        "requires_payment_method"
      ) {
        // Using localStorage to store the state of the retry here
        // (feel free to replace with what you prefer)
        // Store the latest invoice ID and status
        localStorage.setItem("latestInvoiceId", subscription.latest_invoice.id);
        localStorage.setItem(
          "latestInvoicePaymentIntentStatus",
          subscription.latest_invoice.payment_intent.status
        );
        throw { error: { message: "Your card was declined." } };
      } else return { subscription, priceId, paymentMethodId };
    },

    onSubscriptionComplete(result) {
      // Payment was successful.
      if (result.subscription.status === "active") {
        // show a success message
        // Call your backend to grant access to your service based on
        // `result.subscription.items.data[0].price.product` the customer subscribed to.
        // Store the product.id and subscription.id in db

        // Redirect user back to the view that requested for a payment method creation or a custom location
        if (this.redirectObject) this.$router.replace(this.redirectObject);
        else this.$router.go(-1);
      }
    },

    displayError(event) {
      if (event.error) this.stripeValidationError = event.error.message;
      else this.stripeValidationError = "";
    },
  },
};
</script>

<style>
#create-payment-method {
  text-align: left;
}

#card-number-element,
#card-expiry-element,
#card-cvc-element {
  padding: 1em;
  border: 1px solid #e6e5e5;
}
</style>
