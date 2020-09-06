<template>
  <v-main>
    <v-card outlined>
      <v-card-title>
        Earning History
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
        :items="earningsHistory"
        :search="search"
        class="elevation-1"
        :sort-desc="[false, true]"
      >
        <!-- @todo Fix this error -->
        <template #item.classID="{ item }">
          <router-link
            :to="{ name: 'ClassDetails', params: { classID: item.classID } }"
          >
            Click to View
          </router-link>
        </template>
      </v-data-table>
    </v-card>
  </v-main>
</template>

<script>
import { mapState } from "vuex";

export default {
  beforeMount() {
    // Using beforeMount hook to ensure this is ran again even if component is cached when navigating
    // Request store to get and populate all bookings of all classes of the partner
    // @todo To update this to prevent getting all data at once.
    this.$store.dispatch("earningsHistory/getAllEarningsHistory");
  },
  data() {
    return {
      search: "",
      headers: [
        { text: "Booking ID", value: "id" },
        { text: "Class Name", value: "className" },
        { text: "Date", value: "date" },
        { text: "No. of Participants", value: "noOfParticipants" },
        { text: "Points Earned", value: "pointsEarned" },
      ],
    };
  },
  computed: {
    ...mapState("earningsHistory", ["earningsHistory"]),
  },
};
</script>
