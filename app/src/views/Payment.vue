<template>
  <div>
    <v-card class="mx-auto" max-width="344">
      <v-card-text>
        <p class="display-1 text--primary">
          Payment Method
        </p>
        <p>Subscription Plan {{ $route.params.planID }}</p>

        <div class="error red center-align white-text">
          {{ stripeValidationError }}
        </div>

        <div class="col s12 card-element">
          <label>Card Number</label>
          <div id="card-number-element" class="input-value"></div>
        </div>

        <div class="col s6 card-element">
          <label>Expiry Date</label>
          <div id="card-expiry-element"></div>
        </div>

        <div class="col s6 card-element">
          <label>CVC</label>
          <div id="card-cvc-element"></div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn
          text
          class="col s12"
          color="deep-purple centre"
          @click="placeOrderButtonPressed"
        >
          PlaceOrder
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { loadStripe } from "@stripe/stripe-js";

export default {
  components: {},

  data() {
    return {
      stripe: null,
      cardNumberElement: null,
      cardExpiryElement: null,
      cardCvcElement: null,
      amount: 1,
      publishableKey: "",
      customer: {},
      customerId: "cus_HeOaho2iPOkSFW",
      billingName: "zzk",
      priceId: "plan_HEDADPvhVD1zls",
    };
  },

  mounted() {
    (async () => {
      // this.stripe = Stripe("pk_test_LIc2NCzFeOD5ng6VrGwNE8Dx00Z67P4mCD");
      this.stripe = await loadStripe(
        "pk_test_LIc2NCzFeOD5ng6VrGwNE8Dx00Z67P4mCD"
      );
      this.createAndMountFormElement();

      this.createCustomer().then(console.log);
    })();
  },

  methods: {
    createAndMountFormElement() {
      var elements = this.stripe.elements();

      this.cardNumberElement = elements.create("cardNumber");
      this.cardNumberElement.mount("#card-number-element");

      this.cardExpiryElement = elements.create("cardExpiry");
      this.cardExpiryElement.mount("#card-expiry-element");

      this.cardCvcElement = elements.create("cardCvc");
      this.cardCvcElement.mount("#card-cvc-element");

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
    //
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
        fetch("/create-subscription", {
          method: "post",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            customerId: customerId,
            paymentMethodId: paymentMethodId,
            priceId: priceId,
          }),
        })
          .then((response) => {
            return response.json();
          })
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
      if (subscription && subscription.status === "active") {
        // subscription is active, no customer actions required.
        return { subscription, priceId, paymentMethodId };
      }

      // If it's a first payment attempt, the payment intent is on the subscription latest invoice.
      // If it's a retry, the payment intent will be on the invoice itself.
      let paymentIntent = invoice
        ? invoice.payment_intent
        : subscription.latest_invoice.payment_intent;

      if (
        paymentIntent.status === "requires_action" ||
        (isRetry === true && paymentIntent.status === "requires_payment_method")
      ) {
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
      } else {
        // No customer action needed
        return { subscription, priceId, paymentMethodId };
      }
    },

    handlePaymentMethodRequired({ subscription, paymentMethodId, priceId }) {
      if (subscription.status === "active") {
        // subscription is active, no customer actions required.
        return { subscription, priceId, paymentMethodId };
      } else if (
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
      } else {
        return { subscription, priceId, paymentMethodId };
      }
    },

    onSubscriptionComplete(result) {
      // Payment was successful.
      if (result.subscription.status === "active") {
        // show a success message
        // Call your backend to grant access to your service based on
        // `result.subscription.items.data[0].price.product` the customer subscribed to.
        // Store the product.id and subscription.id in db
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
.payment-form {
  max-width: 400px;
  margin: 20px auto;
  border: 1px solid #ececec;
}

.payment-form h5 {
  margin: 0;
  padding: 10px;
  font-size: 1.2rem;
}

.card-element {
  margin-top: 5px;
}

#card-number-element,
#card-expiry-element,
#card-cvc-element {
  background: white;
  padding: 5px;
  border: 1px solid #ececec;
}

.place-order-button-block {
  margin: 10px 0;
}
</style>
