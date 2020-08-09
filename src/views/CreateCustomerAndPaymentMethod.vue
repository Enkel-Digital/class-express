<template>
  <v-main id="create-payment-method">
    <v-app-bar app flat color="white">
      <BackBtn />

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
          You do not have a valid payment method currently.
        </li>

        <li>
          Please create a new payment method before any purchases can be made.
        </li>

        <li>
          Note that all future purchases in App will utilize this payment
          method, until you cancel this payment method, this payment method
          expires or till you choose to change your payment method.
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
        <br />

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
import { apiWithLoader } from "@/utils/billing";
import apiError from "@/store/utils/apiError";
import BackBtn from "@/components/BackBtn";

export default {
  components: {
    BackBtn,
  },

  // "redirectObject" Is any valid object for router.replace(redirectObject). Ref to https://router.vuejs.org/guide/essentials/navigation.html#router-replace-location-oncomplete-onabort
  props: [
    "redirectObject",
    "shouldCreateCustomer",
    "shouldCreatePaymentMethod",
  ],

  created() {
    // Wrapped in an async IIFE as we need to use await
    (async () => {
      // Load stripe object first as we need stripe object to create customer
      this.stripe = await loadStripe(
        process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY
      );

      // Create customer if needed to, and call get setup intent client secret
      // Called without await to not block form creation process
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

        const response = await apiWithLoader.post("/user/create", {
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
      // Using arrow function to keep "this" binding
      this.cardElement.on("change", (event) => {
        const { error } = event;
        if (error) this.displayError(error);
        else this.stripeValidationError = ""; // Clear any previous error if no error in the latest validation
      });
    },

    // create payment method in frontend
    // then send the payment method to billing service
    async createPaymentMethod() {
      const { firstName, lastName } = this.$store.state.user;

      const cardElement = this.cardNumberElement;

      const result = await this.stripe.createPaymentMethod({
        type: "card",
        card: this.cardElement,
        billing_details: {
          name: `${firstName} ${lastName || ""}`,
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
      // Add a loader here as the following stripe API might take a while
      const loaderID = await this.$loader.new();

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

      // Remove loader after stripe API responds
      this.$loader.clear(loaderID);

      if (error) this.displayError(error);
      else {
        if (setupIntent.status === "succeeded") {
          // Redirect user back to custom redirect location or the view that requested for a payment method creation
          if (this.redirectObject) this.$router.replace(this.redirectObject);
          else this.$router.go(-1);
        } else {
          // @todo Do something here? What other status are there other then succeeded? And how to deal with them?
        }
      }
    },

    // get setupIntent client secret
    // reference: https://stripe.com/docs/payments/save-and-reuse#web-collect-card-details
    async getSetupIntentClientSecret() {
      try {
        const { id } = this.$store.state.user;

        const response = await apiWithLoader.get(
          `/setupIntent/card-wallet/${id}`,
          {
            userAccountID: id,
          }
        );
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

    async createSubscription(planId) {
      try {
        const { id } = this.$store.state.user;
        const response = await apiWithLoader.get(`/plans/update/${planId}`, {
          userAccountID: id,
        });
        if (!response.success)
          return apiError(response, this.createSubscription);
      } catch (error) {
        apiError(
          error.message,
          this.createSubscription,
          "Failed to create Subscription"
        );
      }
    },

    displayError(error) {
      this.stripeValidationError = error.message || "error";

      // Create new error and show with ErrorDialog too
      this.$error.new(
        this.$error.createError(
          this.$error.ERROR.level.RETRY,
          this.$error.ERROR.custom("BILLING", this.stripeValidationError),
          error
        )
      );
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
