<template>
  <v-card id="points-card" class="mx-auto" max-width="344" outlined>
    <v-list-item>
      <v-list-item-content>
        <p class="overline">your points</p>

        <v-list-item-title class="headline mb-1">
          {{ userPoints.left }} / {{ userPoints.total }} points
        </v-list-item-title>

        <v-list-item-subtitle>
          Period ends on: {{ userPoints.period.end }}
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-btn :to="{ name: 'topup' }" color="primary">topup</v-btn>
    </v-list-item>
  </v-card>
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
    ...mapState("points", ["userPoints"])
    // ,...mapState("subscription", ["currentPlanID"])
  }
};
</script>

<style scoped>
#points-card {
  text-align: left;
}
</style>
