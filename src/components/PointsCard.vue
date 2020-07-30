<template>
  <v-responsive id="points-card">
    <!-- If user already has a plan and points object is loaded from API -->
    <v-card
      v-if="current && points"
      class="mx-auto"
      max-width="calc(100% - 3em)"
      outlined
    >
      <v-list-item>
        <v-list-item-content>
          <p class="overline">your points</p>

          <v-list-item-title class="headline mb-1">
            {{ points.left }} / {{ points.total }} points
          </v-list-item-title>

          <v-list-item-subtitle>
            Period ends on:
            {{ moment.unix(points.period.end).format("DD/MM/YYYY") }}
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-btn v-if="!hideActionButton" :to="{ name: 'topup' }" color="primary">
          topup
        </v-btn>
      </v-list-item>
    </v-card>

    <!-- If the user does not have a plan yet -->
    <v-card v-else class="mx-auto" max-width="calc(100% - 3em)" outlined>
      <v-list-item>
        <v-list-item-content>
          <p class="overline">you are not on a plan yet?!</p>

          <v-list-item-title class="headline mb-1">
            Join a plan now!
          </v-list-item-title>

          <v-list-item-subtitle>
            *Each plan lasts 30 days
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-btn
          v-if="!hideActionButton"
          :to="{ name: 'subscription' }"
          color="primary"
        >
          plans
        </v-btn>
      </v-list-item>
    </v-card>
  </v-responsive>
</template>

<script>
import logout from "@/controllers/logout";
import { mapState } from "vuex";

export default {
  name: "PointsCard",
  props: ["hideActionButton"],
  computed: {
    ...mapState("points", ["points"]),
    ...mapState("subscription", ["current"]),
  },
};
</script>

<style scoped>
#points-card {
  text-align: left;
}
</style>
