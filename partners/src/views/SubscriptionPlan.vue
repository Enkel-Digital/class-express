<template>
  <v-main class="subscription">
    <v-app-bar app color="orange lighten-1" flat dark fixed>
      <BackBtn />
      <v-toolbar-title>Subscription</v-toolbar-title>
    </v-app-bar>

    <h3 style="color: rgba(0, 0, 0, 0.65); text-align: left" class="ma-5 mb-0">
      Get more for less!
    </h3>

    <!-- Update below to show one of the cards what is your current plan -->
    <v-responsive>
      <v-list-item id="user-details-card" class="mb-0 pb-0 mt-0 pt-0">
        <v-list-item>
          <v-list-item-content>
            <p style="color: rgba(0, 0, 0, 0.8)">
              We offer Monthly subscription plans to give you points for less!
            </p>
          </v-list-item-content>
        </v-list-item>
      </v-list-item>
    </v-responsive>

    <PointsCard />

    <br />
    <h3 style="color: rgba(0, 0, 0, 0.65); text-align: left" class="ml-5">
      Subscription Plans
    </h3>
    <p style="color: rgba(0, 0, 0, 0.6); text-align: left" class="ml-5 mb-0">
      Your current plan ends on
      <span style="font-weight: bold">{{ periodEndDate }}</span>
      <br />Click to change next month's plan
    </p>

    <v-radio-group v-model="selectedPlanID">
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
              <span
                v-if="nextPlanID !== currentPlanID"
                style="color: black; font-weight: bold"
              >
                <span v-if="plan.id === currentPlanID">(Current)</span>
                <span v-if="plan.id === nextPlanID">(Next)</span>
              </span>

              {{ plan.description }}
            </v-list-item-subtitle>

            <v-list-item-title class="headline mb-1">
              {{ plan.totalPoints }} points for {{ plan.price.currency }}
              {{ plan.price.value }}
            </v-list-item-title>

            <p style="color: rgba(0, 0, 0, 0.7); font-size: 0.8em" class="mb-0">
              <span v-html="plan.copywriting" />
            </p>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-radio-group>

    <v-card
      class="mx-auto mb-4"
      max-width="344"
      outlined
      style="text-align: left"
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
      style="text-align: left"
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
  </v-main>
</template>

<script>
import logout from "@/controllers/logout";
import BackBtn from "@/components/BackBtn";
import PointsCard from "@/components/PointsCard";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "subscription",
  components: {
    BackBtn,
    PointsCard,
  },
  beforeMount() {
    // Using beforeMount hook to ensure this is ran again even if component is cached when navigating
    // Request store to get and populate list of subscription plans
    this.$store.dispatch("subscription/init");
  },
  computed: {
    periodEndDate() {
      return this.$store.state.points.points.period.end;
    },
    ...mapState(["user", "points"]),
    ...mapState("subscription", [
      "subscriptionPlans",
      "currentPlanID",
      "nextPlanID",
    ]),
    ...mapGetters("subscription", ["currentPlan", "nextPlan"]),
    selectedPlanID() {
      return this.currentPlanID === this.nextPlanID
        ? this.currentPlanID
        : this.nextPlanID;
    },
  },
  methods: {
    logout,
    ...mapActions("subscription", ["updatePlan"]),
  },
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
