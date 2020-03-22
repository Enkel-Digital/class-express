<template>
  <v-content class="subscription">
    <v-app-bar app color="orange lighten-1" flat dark fixed>
      <BackBtn />
      <v-toolbar-title>Subscription</v-toolbar-title>
    </v-app-bar>

    <h3 style="color: rgba(0, 0, 0, 0.65); text-align: left;" class="ma-5 mb-0">
      Your Current plan and details
    </h3>

    <!-- Update below to show one of the cards what is your current plan -->
    <v-responsive>
      <v-list-item id="user-details-card" class="mb-0 pb-0 mt-0 pt-0">
        <v-list-item>
          <v-list-item-content>
            <p style="color: rgba(0, 0, 0, 0.8);">
              Topup your points to attend classes! This works on a subscription
              basis and just select your plan, and you will get a fix amount of
              points every single month!
            </p>
          </v-list-item-content>
        </v-list-item>
      </v-list-item>
    </v-responsive>

    <PointsCard />

    <br />
    <h3 style="color: rgba(0, 0, 0, 0.65); text-align: left;" class="ml-5">
      Subscription Plans
    </h3>
    <p style="color: rgba(0, 0, 0, 0.6); text-align: left;" class="ml-5 mb-0">
      Click a different plan to change your plan!
    </p>
    <p style="color: rgba(0, 0, 0, 0.6); text-align: left;" class="ml-5  mb-0">
      Your new plan will take effect the next month.
    </p>

    <v-radio-group v-model="currentPlanID">
      <v-card
        v-for="(plan, i) in subscriptionPlans"
        :key="i"
        id="plans-card"
        class="mx-auto mb-4"
        max-width="344"
        outlined
        @click="updatePlan(plan.id)"
      >
        <v-list-item>
          <v-radio :value="plan.id" />

          <v-list-item-content>
            <v-list-item-subtitle>
              {{ plan.description }}
            </v-list-item-subtitle>

            <v-list-item-title class="headline mb-1">
              {{ plan.totalPoints }} points for {{ plan.price.currency }}
              {{ plan.price.value }}
            </v-list-item-title>

            <p style="color: rgba(0, 0, 0, 0.7); font-size: 0.8em" class="mb-0">
              <span v-html="plan.copywriting"></span>
            </p>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-radio-group>

    <v-card
      class="mx-auto mb-4"
      max-width="344"
      outlined
      style="text-align: left;"
      :to="{ name: 'topup' }"
    >
      <v-list-item>
        <v-list-item-content>
          <p class="overline">Customise?</p>

          <v-list-item-title class="headline mb-1">
            Buy points whenever
          </v-list-item-title>

          <p style="color: rgba(0, 0, 0, 0.7); font-size: 0.8em" class="mb-0">
            Want a Custom plan? We got you covered!<br />Flexibility to
            experiment so you can do you!
          </p>
        </v-list-item-content>
      </v-list-item>
    </v-card>

    <v-card
      class="mx-auto mb-4"
      max-width="344"
      outlined
      style="text-align: left;"
      :to="{ name: 'faq' }"
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
  </v-content>
</template>

<script>
import logout from "@/controllers/logout";
import BackBtn from "@/components/BackBtn";
import PointsCard from "@/components/PointsCard";
import { mapState } from "vuex";

export default {
  name: "topup",
  components: {
    BackBtn,
    PointsCard
  },
  beforeCreate() {
    // Request store to get and populate list of subscription plans
    this.$store.dispatch("subscription/getPlans");
  },
  data() {
    return {
      name: "JJ Lee",
      email: "JJ@enkeldigital.com",
      periodEndDate: "20 / 4 / 2020",
      pointsLeft: 20,
      totalPoints: 45,
      currentPlanID: 0
    };
  },
  computed: {
    ...mapState("subscription", ["subscriptionPlans"])
  },
  methods: {
    logout,
    updatePlan(planID) {
      // If user selects own plan, ignore selection
      if (this.currentPlanID === planID) return;

      // Set the selected Plan to show on the radio buttons
      console.log("Selected plan:", planID);

      if (confirm("Confirm change of Subscription Plan!")) {
        // @todo Show loading bar before calling API for pessimistic UI

        // Call logic to update the plan

        console.log("Plan is updated");

        // Pessimistic UI, show after network update is complete
        this.currentPlanID = planID;
      }
    }
  }
};
</script>

<style scoped>
#user-details-card {
  text-align: left;
  margin: 1em;
  margin-top: 2em;
}

#points-card {
  text-align: left;
}
</style>
