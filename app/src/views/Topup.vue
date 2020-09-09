<template>
  <v-main class="topup">
    <v-app-bar app color="orange lighten-1" flat dark fixed>
      <BackBtn />
      <v-toolbar-title>Topup</v-toolbar-title>
    </v-app-bar>

    <h3 style="color: rgba(0, 0, 0, 0.65); text-align: left" class="ma-5 mb-0">
      Your plan and points
    </h3>
    <p style="color: rgba(0, 0, 0, 0.6); text-align: left" class="ml-5">
      Need more points? Topup anytime at flat rates!
    </p>

    <PointsCard :hideActionButton="true" />

    <br />

    <v-card
      class="mx-auto mb-4"
      max-width="calc(100% - 3em)"
      outlined
      style="text-align: left"
      :to="{ name: 'subscription' }"
      replace
    >
      <v-list-item>
        <v-list-item-content>
          <p class="overline">See your subscription plan</p>

          <v-list-item-subtitle>
            & Checkout out other plans too
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card>

    <h3 style="color: rgba(0, 0, 0, 0.65); text-align: left" class="ml-5">
      Topup
    </h3>

    <v-card
      v-for="(topupOption, i) in topupOptions"
      :key="i"
      id="plans-card"
      class="mx-auto mb-4"
      max-width="calc(100% - 3em)"
      outlined
      @click="buyPoints(topupOption.id)"
      style="text-align: left"
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-subtitle class="pt-1">
            {{ topupOption.name }}
          </v-list-item-subtitle>

          <v-list-item-title class="headline mb-1">
            {{ topupOption.totalPoints }} points for
            {{ topupOption.currency }}
            {{ topupOption.price }}
          </v-list-item-title>

          <p style="color: rgba(0, 0, 0, 0.7); font-size: 0.8em" class="mb-0">
            <span v-html="topupOption.copywriting" />
          </p>
        </v-list-item-content>
      </v-list-item>
    </v-card>

    <h3 style="color: rgba(0, 0, 0, 0.65); text-align: left" class="ml-5">
      Subscription Plans
    </h3>

    <v-card
      class="mx-auto mb-4"
      max-width="calc(100% - 3em)"
      outlined
      style="text-align: left"
      :to="{ name: 'subscription' }"
      replace
    >
      <v-list-item>
        <v-list-item-content>
          <p class="overline">want a better deal?</p>

          <v-list-item-title class="headline mb-1">
            Monthly plans available
          </v-list-item-title>

          <p style="color: rgba(0, 0, 0, 0.7); font-size: 0.8em" class="mb-0">
            Checkout our monthly plans for more discount.
          </p>
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
import logout from "@/controllers/logout";
import BackBtn from "@/components/BackBtn";
import PointsCard from "@/components/PointsCard";
import { mapState, mapActions } from "vuex";

export default {
  name: "topup",
  components: {
    BackBtn,
    PointsCard,
  },
  beforeCreate() {
    // Request vuex to update/populate list of topup options
    this.$store.dispatch("points/getTopupOptions");
  },
  computed: mapState("points", ["points", "topupOptions"]),
  methods: {
    logout,
    ...mapActions("points", ["buyPoints"]),
  },
};
</script>

<style scoped>
#user-details-card {
  text-align: left;
  margin: 1em;
  margin-top: 2em;
}
</style>
