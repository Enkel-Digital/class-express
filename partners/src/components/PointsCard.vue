<template>
  <v-responsive>
    <v-card id="points-card" class="mx-auto" max-width="344" outlined>
      <v-list-item>
        <v-list-item-content>
          <p class="overline">your points</p>

          <v-list-item-title class="headline mb-1">
            {{ points.left }} / {{ points.total }} points
          </v-list-item-title>

          <v-list-item-subtitle>
            Period ends on: {{ moment.unix(points.period.end).format("L") }}
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-btn :to="{ name: 'topup' }" color="primary">topup</v-btn>
      </v-list-item>
    </v-card>

    <!-- If user already has a plan -->
    <!-- <v-card
      v-if="currentPlanID"
      id="points-card"
      class="mx-auto"
      max-width="344"
      outlined
    >
      <v-list-item>
        <v-list-item-content>
          <p class="overline">your points</p>

          <v-list-item-title class="headline mb-1">
            {{ points.left }} / {{ points.total }} points
          </v-list-item-title>

          <v-list-item-subtitle>
            Period ends on: {{ points.period.end }}
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-btn :to="{ name: 'topup' }" color="primary">topup</v-btn>
      </v-list-item>
    </v-card> -->

    <!-- If the user does not have a plan yet -->
    <!-- <v-card v-else id="points-card" class="mx-auto" max-width="344" outlined>
      <v-list-item>
        <v-list-item-content>
          <p class="overline">no points nor plan yet?</p>

          <v-list-item-title class="headline mb-1">
            Join a plan!
          </v-list-item-title>

          <v-list-item-subtitle>
            Each plan last for a month
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-btn :to="{ name: 'subscription' }" color="primary">plans</v-btn>
      </v-list-item>
    </v-card> -->
  </v-responsive>
</template>

<script>
import logout from "@/controllers/logout";
import { mapState } from "vuex";

export default {
  name: "profile",
  beforeCreate() {
    // @todo Remove this and initialize it elsewhere
    this.$store.dispatch("points/init");
  },
  computed: {
    ...mapState("points", ["points"])
    // ,...mapState("subscription", ["currentPlanID"])
  }
};
</script>

<style scoped>
#points-card {
  text-align: left;
}
</style>
