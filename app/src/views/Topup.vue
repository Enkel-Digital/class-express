<template>
  <v-content class="topup" v-touch="{ right: () => $router.back() }">
    <v-app-bar app color="orange lighten-1" flat dark fixed>
      <BackBtn />
      <v-toolbar-title>Topup</v-toolbar-title>
    </v-app-bar>

    <h3 style="color: rgba(0, 0, 0, 0.65); text-align: left;" class="ma-5 mb-0">
      Your plan and points
    </h3>
    <p style="color: rgba(0, 0, 0, 0.6); text-align: left;" class="ml-5">
      Need more points? Topup anytime at flat rates!
    </p>

    <!-- @todo If user does not have a plan, show card to ask user to buy a subscription plan -->
    <v-card
      id="points-card"
      class="mx-auto mb-4"
      max-width="calc(100% - 3em)"
      outlined
    >
      <v-list-item>
        <v-list-item-content>
          <p class="overline">your points</p>

          <v-list-item-subtitle>
            Period ends on: {{ moment.unix(points.period.end).format("L") }}
          </v-list-item-subtitle>

          <v-list-item-title class="headline mb-1">
            {{ points.left }} / {{ points.total }} points left
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-card>

    <v-card
      class="mx-auto mb-4"
      max-width="calc(100% - 3em)"
      outlined
      style="text-align: left;"
      :to="{ name: 'subscription' }"
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

    <h3 style="color: rgba(0, 0, 0, 0.65); text-align: left;" class="ml-5">
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
      style="text-align: left;"
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-subtitle class="pt-1">
            {{ topupOption.description }}
          </v-list-item-subtitle>

          <v-list-item-title class="headline mb-1">
            {{ topupOption.totalPoints }} points for
            {{ topupOption.price.currency }}
            {{ topupOption.price.value }}
          </v-list-item-title>

          <p style="color: rgba(0, 0, 0, 0.7); font-size: 0.8em;" class="mb-0">
            <span v-html="topupOption.copywriting" />
          </p>
        </v-list-item-content>
      </v-list-item>
    </v-card>

    <h3 style="color: rgba(0, 0, 0, 0.65); text-align: left;" class="ml-5">
      Subscription Plans
    </h3>

    <v-card
      class="mx-auto mb-4"
      max-width="calc(100% - 3em)"
      outlined
      style="text-align: left;"
      :to="{ name: 'subscription' }"
    >
      <v-list-item>
        <v-list-item-content>
          <p class="overline">want a better deal?</p>

          <v-list-item-title class="headline mb-1">
            Monthly plans available
          </v-list-item-title>

          <p style="color: rgba(0, 0, 0, 0.7); font-size: 0.8em;" class="mb-0">
            Checkout our monthly plans for more discount.
          </p>
        </v-list-item-content>
      </v-list-item>
    </v-card>

    <v-card
      class="mx-auto mb-4"
      max-width="calc(100% - 3em)"
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
import { Touch } from "vuetify/lib/directives";
import logout from "@/controllers/logout";
import BackBtn from "@/components/BackBtn";
import { mapState, mapActions } from "vuex";

export default {
  name: "topup",
  directives: {
    Touch
  },
  components: {
    BackBtn
  },
  beforeCreate() {
    // Request vuex to update/populate list of topup options
    this.$store.dispatch("points/getTopupOptions");
  },
  computed: mapState("points", ["points", "topupOptions"]),
  methods: {
    logout,
    ...mapActions("points", ["buyPoints"])
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
