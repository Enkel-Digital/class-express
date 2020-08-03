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
          <label>Card Number</label>
          <div id="card-number-element" class="input-value"></div>
        </div>

        <br />

        <div class="card-element">
          <label>Expiry Date</label>
          <div id="card-expiry-element"></div>
        </div>

        <br />

        <div class="card-element">
          <label>CVC</label>
          <div id="card-cvc-element"></div>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn
          text
          class="col"
          color="deep-purple"
          @click="placeOrderButtonPressed"
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
      this.createAndMountFormElement();

      if (this.shouldCreateCustomer) this.createCustomer();
    })();
  },

  data() {
    return {
      stripe: null,
      cardNumberElement: null,
      cardExpiryElement: null,
      cardCvcElement: null,
      amount: 1,
      // @todo Change or remove these variables.
      publishableKey: "",
      customer: {},
      customerId: "cus_HeOaho2iPOkSFW",
      billingName: "zzk",
      priceId: "plan_HEDADPvhVD1zls",

      // Registering on the component first before using
      stripeValidationError: undefined,
    };
  },

  methods: {
    // Creates billing customer with billing service using user details in vuex store
    async createCustomer() {
      const { id, email, firstName } = this.$store.state.user;
      const response = await api.post("/user/create", {
        userAccountID: id,
        userDetails: {
          email,
          firstName,
        },
      });

      if (!response.success) return apiError(response, this.createCustomer);
    },

    createAndMountFormElement() {
      var elements = this.stripe.elements();

      this.cardNumberElement = elements.create("cardNumber");
      this.cardNumberElement.mount("#card-number-element");

      this.cardExpiryElement = elements.create("cardExpiry");
      this.cardExpiryElement.mount("#card-expiry-element");

      this.cardCvcElement = elements.create("cardCvc");
      this.cardCvcElement.mount("#card-cvc-element");

      // @todo Maybe dont do it like this? Only check / validate once the user press the button?
      this.cardNumberElement.on("change", this.validateCardOnChange);
      this.cardExpiryElement.on("change", this.validateCardOnChange);
      this.cardCvcElement.on("change", this.validateCardOnChange);
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

    placeOrderButtonPressed() {
      const priceId = this.priceId;
      const customerId = this.customerID;

      this.createPaymentMethod({
        cardElement: this.cardNumberElement,
        customerId,
        priceId,
      });
    },

    // create payment method in frontend
    // then send the payment method to billing service
    createPaymentMethod(cardElement, customerId, priceId) {
      return this.stripe
        .createPaymentMethod({
          type: "card",
          card: this.cardNumberElement,
          billing_details: {
            name: this.billingName,
          },
        })
        .then((result) => {
          if (result.error) {
            this.displayError(result.error);
          } else {
            //   this.createSubscription({
            //     customerId: customerId,
            //     paymentMethodId: result.paymentMethod.id,
            //     priceId: priceId,
            //   });
            console.log(result);
          }
        });
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
      if (event.error) {
        this.stripeValidationError = event.error.message;
      } else {
        this.stripeValidationError = "";
      }
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
