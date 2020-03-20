<template>
  <v-content class="topup">
    <v-app-bar app color="orange lighten-1" flat dark fixed>
      <BackBtn />
      <v-toolbar-title>Topup</v-toolbar-title>
    </v-app-bar>

    <h3 style="color: rgba(0, 0, 0, 0.65); text-align: left;" class="ma-5 mb-0">
      Your Current plan and details
    </h3>

    <!-- Update below to show one of the cards what is your current plan -->
    <v-responsive>
      <v-list-item id="user-details-card" class="mb-0 pb-0 mt-0 pt-0">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-content>
              <h3>{{ name }}</h3>
              <p>{{ email }}</p>
            </v-list-item-content>

            <p style="color: rgba(0, 0, 0, 0.8);">
              Topup your points to attend classes! This works on a subscription
              basis and just select your plan, and you will get a fix amount of
              points every single month!
            </p>
          </v-list-item-content>
        </v-list-item>
      </v-list-item>
    </v-responsive>

    <v-card id="points-card" class="mx-auto" max-width="344" outlined>
      <v-list-item>
        <v-list-item-content>
          <p class="overline">Your Points</p>

          <v-list-item-subtitle>
            Period ends on: {{ periodEndDate }}
          </v-list-item-subtitle>

          <v-list-item-title class="headline mb-1">
            {{ pointsLeft }} / {{ totalPoints }} points left
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-card>

    <br />
    <h3 style="color: rgba(0, 0, 0, 0.65); text-align: left;" class="ml-5">
      Subscription Plans
    </h3>

    <v-radio-group v-model="selectedPlan">
      <v-card
        v-for="(plan, i) in plans"
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

    <!-- Old UI for buying or changing plans. Using confirm alert box for now -->
    <!-- <v-card
      v-if="selectedPlan && selectedPlan !== originalPlan"
      class="mx-auto mb-4"
      max-width="344"
      outlined
      style="text-align: left;"
      color="orange lighten-2"
      @click="updatePlan"
    >
      <v-list-item class="mt-0">
        <v-list-item-content>
          <v-list-item-title v-if="originalPlan" class="headline mb-1">
            Change plan!
          </v-list-item-title>

          <v-list-item-title v-else class="headline mb-1">
            Buy plan!
          </v-list-item-title>

          <v-list-item-subtitle>
            SelectedPlan: {{ selectedPlan }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card> -->

    <v-card
      class="mx-auto mb-4"
      max-width="344"
      outlined
      style="text-align: left;"
      :to="{ name: 'test' }"
    >
      <v-list-item>
        <v-list-item-content>
          <p class="overline">Custom Plan?</p>

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

export default {
  name: "topup",
  components: {
    BackBtn
  },
  data() {
    return {
      name: "JJ Lee",
      email: "JJ@enkeldigital.com",
      periodEndDate: "20 / 4 / 2020",
      pointsLeft: 20,
      totalPoints: 45,
      // Original plan and selected plan is the same at the start.
      originalPlan: 1,
      selectedPlan: 1,
      plans: [
        {
          id: 1,
          description: "Starter Pack",
          copywriting:
            "Hate being tied down?<br />Start simple and topup anytime!",
          totalPoints: 50,
          price: {
            value: 59,
            currency: "SGD"
          }
        },
        {
          id: 2,
          description: "Gold members",
          copywriting: "A Better deal, A Better you!",
          totalPoints: 100,
          price: {
            value: 89,
            currency: "SGD"
          }
        },
        {
          id: 3,
          description: "Platinum",
          copywriting:
            "Go platinum, or Go home.<br />Join platinum for exclusive in app deals!",
          totalPoints: 120,
          price: {
            value: 100,
            currency: "SGD"
          }
        }
      ]
    };
  },
  methods: {
    logout,
    updatePlan(planID) {
      // If user selects own plan, ignore selection
      if (this.selectedPlan === planID) return;

      // Set the selected Plan to show on the radio buttons
      console.log("Selected planID", planID);

      if (confirm("Confirm change of Subscription Plan!")) {
        // Call logic to update the plan

        console.log("Plan is updated");

        // Pessimistic UI, show after network update is complete
        // @todo Show a loading bar first when clicked
        this.selectedPlan = planID;
      } else {
        // Show some UI? Or just do nothing and reset the selection.
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
