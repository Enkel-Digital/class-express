<template>
  <v-content>
    <v-card outlined>
      <v-card-title>
        Active Classes Booking List
        <v-spacer />

        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        />
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="bookings"
        :search="search"
        class="elevation-1"
        :sort-desc="[false, true]"
      >
        <template #item.classID="{ item }">
          <router-link
            :to="{ name: 'ClassDetails', params: { classID: item.classID } }"
          >
            Click to View
          </router-link>
        </template></v-data-table
      >
    </v-card>
  </v-content>
</template>

<script>
import { mapState } from "vuex";

export default {
  beforeMount() {
    // Using beforeMount hook to ensure this is ran again even if component is cached when navigating
    // Request store to get and populate all bookings of all classes of the partner
    // @todo To update this to prevent getting all data at once.
    this.$store.dispatch("bookings/getAllBookings");
  },
  data() {
    return {
      search: "",
      headers: [
        { text: "User ID", value: "id" },
        { text: "Name", value: "name" },
        // { text: "Email", value: "email" }, // Not doing for now for privacy concerns
        { text: "Class Name", value: "className" },
        { text: "Start Time", value: "startTime" },
        { text: "Class Detail", value: "classID" },
      ],
    };
  },
  computed: {
    ...mapState("bookings", ["bookings"]),
  },
};
</script>
