<template>
  <v-main id="subscription">
    <v-app-bar app color="orange lighten-1" flat dark fixed>
      <BackBtn />
      <v-toolbar-title>Subscription</v-toolbar-title>
    </v-app-bar>

    <h3 class="opacity7 ma-5 mb-0">Get more for less!</h3>

    <!-- Update below to show one of the cards what is your current plan -->
    <v-responsive>
      <v-list-item class="mb-0 pb-0 mt-0 pt-0">
        <v-list-item>
          <v-list-item-content>
            Our Monthly subscription plans gives you more points for less!
            😁💪🏻<br />
            <span class="opacity6 fontsize8">
              *A month is always 30 days for affordable AND predicatable pricing
            </span>
          </v-list-item-content>
        </v-list-item>
      </v-list-item>
    </v-responsive>

    <PointsCard />

    <br />
    <h3 class="opacity7 ml-5">Subscription Plans</h3>

    <p v-if="current" class="opacity6 ml-5 mb-0">
      <span v-if="periodEndDate !== null" style="font-weight: bold">
        Your current plan ends on
        {{ moment.unix(periodEndDate).format("DD/MM/YYYY") }}
        <br />
      </span>
      Click to change next month's plan
    </p>
    <p v-else class="opacity6 ml-5 mb-0">Select a plan to buy it now!</p>

    <v-radio-group v-model="selectedPlanID">
      <v-card
        v-for="(plan, i) in subscriptionPlans"
        :key="i"
        id="plans-card"
        class="mx-auto mb-4"
        max-width="calc(100% - 3em)"
        outlined
        @click="updatePlan(plan.id)"
      >
        <v-list-item>
          <v-radio :value="plan.id" />

          <v-list-item-content>
            <v-list-item-subtitle>
              <!-- Ensure next/current plans are loaded before checking for equality -->
              <span
                v-if="next && current && next.planID !== current.planID"
                style="color: black; font-weight: bold"
              >
                <span v-if="plan.id === current.planID">(Current)</span>
                <span v-if="plan.id === next.planID">(Next)</span>
              </span>

              {{ plan.name }}
            </v-list-item-subtitle>

            <v-list-item-title class="headline mb-1">
              {{ plan.totalPoints }} points for {{ plan.currency }}
              {{ plan.price }}
            </v-list-item-title>

            <p class="opacity7 fontsize8 mb-0">
              <span v-html="plan.copywriting" />
            </p>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-radio-group>

    <v-card
      v-if="current"
      class="mx-auto mb-4"
      max-width="calc(100% - 3em)"
      outlined
      style="text-align: left"
      :to="{ name: 'topup' }"
      replace
    >
      <v-list-item>
        <v-list-item-content>
          <p class="overline">Customise?</p>

          <v-list-item-title class="headline mb-1">
            Buy points whenever
          </v-list-item-title>

          <p class="opacity7 fontsize8 mb-0">
            Want a Custom plan? We got you covered!<br />Flexibility to
            experiment so you can do you!
          </p>
        </v-list-item-content>
      </v-list-item>
    </v-card>

    <v-card
      v-if="current"
      class="mx-auto mb-4"
      max-width="calc(100% - 3em)"
      outlined
      style="text-align: left"
      @click="pauseSubscriptionPlan"
    >
      <v-list-item>
        <v-list-item-content>
          <p class="overline">Need to pause your plan?</p>

          <v-list-item-subtitle>
            Pause your plan, e.g. when you are traveling!
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card>

    <v-card
      v-if="current"
      class="mx-auto mb-4"
      max-width="calc(100% - 3em)"
      outlined
      style="text-align: left"
      :to="{ name: 'cancel-subscription' }"
      replace
    >
      <v-list-item>
        <v-list-item-content>
          <p class="overline">Want to cancel your plan instead?</p>

          <v-list-item-subtitle>
            Let us know why and cancel your plan here.
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card>

    <!-- @todo Update the contact/sales email -->
    <v-card
      class="mx-auto mb-4"
      max-width="calc(100% - 3em)"
      outlined
      style="text-align: left"
      href="mailto:contact@enkeldigital.com"
    >
      <v-list-item>
        <v-list-item-content>
          <p class="overline">Interested in Enterprise offerings?</p>

          <v-list-item-subtitle>
            Reach out to us for more details!
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card>

    <v-card
      class="mx-auto mb-4"
      max-width="calc(100% - 3em)"
      outlined
      style="text-align: left"
      :to="{ name: 'faq' }"
      replace
    >
      <v-list-item>
        <v-list-item-content>
          <p class="overline">Want to learn more?</p>

          <v-list-item-subtitle>
            Checkout our F.A.Q page for more details!
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </v-main>
</template>

<script>
import BackBtn from "@/components/BackBtn";
import PointsCard from "@/components/PointsCard";
import { mapState, mapActions } from "vuex";

export default {
  name: "subscription",
  components: {
    BackBtn,
    PointsCard,
  },
  beforeMount() {
    // Using beforeMount hook to ensure this is ran again even if component is cached when navigating
    // Request store to get user's plans and list of subscription plans
    this.$store.dispatch("subscription/getUserPlans");
    this.$store.dispatch("subscription/getPlans");
  },
  computed: {
    ...mapState(["user", "points"]),
    ...mapState("subscription", ["subscriptionPlans", "current", "next"]),
    selectedPlanID() {
      return this.next?.planID || this.current?.planID;
    },
    periodEndDate() {
      return this.current?.end;
    },
  },
  methods: {
    async updatePlan() {
      const billing = await import("@/utils/billing");
      const {
        customerDoesNotExists,
        paymentMethodNotAvailable,
      } = await billing.checkCustomerAndPaymentMethodStatus(this.user.id);

      if (customerDoesNotExists || paymentMethodNotAvailable)
        // @todo Instead of push, might want to use replace or something instead, since I have a valid redirect object
        return this.$router.push({
          name: "payment",
          query: {
            // @todo This works, HOWEVER, this might be vulnerable as we are passing JS objects via URL, which potentially is an attack surface for attackers to inject code into router.push directly.
            redirectObject: { name: "subscription" },
            shouldCreateCustomer: customerDoesNotExists,
            shouldCreatePaymentMethod: paymentMethodNotAvailable,
          },
        });

      this.$store.dispatch("subscription/updatePlan", ...arguments);
    },
    pauseSubscriptionPlan() {
      // @todo Implement this
      alert("This feature is not supported yet!");
    },
  },
};
</script>

<style scoped>
#subscription {
  text-align: left;
}

.opacity6 {
  color: rgba(0, 0, 0, 0.6);
}

.opacity7 {
  color: rgba(0, 0, 0, 0.7);
}

.fontsize8 {
  font-size: 0.8em;
}
</style>
