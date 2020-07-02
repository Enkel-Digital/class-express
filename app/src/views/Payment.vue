<template>
  <div>
    <v-card class="mx-auto" max-width="344">
      <v-card-text>
        <p class="display-1 text--primary">
          Payment Method
        </p>
        <p>Subscription Plan {{ $route.params.planID }}</p>
        <div class="text--primary error red center-align white-text">
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
<script src="https://js.stripe.com/v3/"></script>
<script>
export default {
  components: {},

  data() {
    return {
      stripe: null,
      cardNumberElement: null,
      cardExpiryElement: null,
      cardCVCElement: null,
      amount: 1,
      stripeValidationError: null,

      cardName: "",
      cardNumber: "",
      cardMonth: "",
      cardYear: "",
      cardCvc: "",
      expiryDate: "",
    };
  },

  mounted() {
    let stripeaScript = document.createElement("script");
    stripeaScript.setAttribute("src", "https://js.stripe.com/v3/");
    stripeaScript.async = true;
    document.head.appendChild(stripeaScript);

    this.stripe = Stripe("pk_test_LIc2NCzFeOD5ng6VrGwNE8Dx00Z67P4mCD");
    this.createAndMountFormElement();
  },
  methods: {
    createAndMountFormElement() {
      var elements = this.stripe.elements();

      console.log(elements);
      this.cardNumberElement = elements.create("cardNumber");
      this.cardNumberElement.mount("#card-number-element");

      this.cardExpiryElement = elements.create("cardExpiry");
      this.cardExpiryElement.mount("#card-expiry-element");

      this.cardCvcElement = elements.create("cardCvc");
      this.cardCvcElement.mount("#card-cvc-element");

      this.cardNumberElement.on("change", this.setValidationError);
      this.cardExpiryElement.on("change", this.setValidationError);
      this.cardCVCElement.on("change", this.setValidationError);
    },
    setValidationError(event) {
      this.stripeValidationError = event.error ? event.error.message : "";
    },
    placeOrderButtonPressed() {
      this.stripe.createToken(this.cardNumberElement).then((result) => {
        if (result.error) {
          this.stripeValidationError = result.error.message;
        } else {
          var stripeObject = {
            amount: this.amount,
            source: result.token,
          };

          console.log(stripeObject);
        }
      });
    },
    updateCardNumber(val) {},
    updateCardName(val) {},
    updateCardMonth(val) {},
    updateCardYear(val) {},
    updateCardCvv(val) {},
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
