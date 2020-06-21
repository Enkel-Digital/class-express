<template>
  <v-content id="ManageEmployee">
    <masonry
      :cols="{ default: 5, 1000: 3, 700: 2, 400: 1 }"
      :gutter="{ default: '0.5em', 700: '0.25em' }"
    >
      <v-card
        v-for="employee in employees"
        class="class-card"
        :key="employee.id"
        outlined
      >
        <v-list-item two-line>
          <v-list-item-content>
            <div v-resize-text>{{ employee.name }}</div>
            <v-list-item-subtitle>{{ employee.email }}</v-list-item-subtitle>
            <v-list-item-subtitle>{{ employee.position }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item-avatar size="80">
          <v-img :src="employee.picture" alt="Logo" />
        </v-list-item-avatar>

        <v-card-actions class="justify-center pa-0">
          <v-btn small text>Delete</v-btn>
          <v-btn small text>more info</v-btn>
        </v-card-actions>

        <!-- <v-card-actions class="justify-center pa-0">
          <v-btn text>more info</v-btn>
        </v-card-actions> -->
      </v-card>
    </masonry>
  </v-content>
</template>

<script>
// import ResizeText from "vue-resize-text";
import { mapState } from "vuex";

export default {
  name: "ManageEmployees",
  directives: {
    ResizeText: () => import("vue-resize-text"),
  },
  beforeMount() {
    // Using beforeMount hook to ensure this is ran again even if component is cached when navigating
    // Request store to get and populate all bookings of all classes of the partner
    // @todo To update this to prevent getting all data at once.
    this.$store.dispatch("employees/getAllEmployees");
  },
  computed: {
    ...mapState("employees", ["employees"]),
  },
};
</script>

<style scoped>
#ManageEmployee {
  margin: 2em;
  margin-top: 2em;
}
.class-card {
  display: inline-block;
  margin-bottom: 0.5em;
}
</style>
