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
import api from "../store/utils/fetch";

export default {
  props: {
    partnerID: {
      default: 3,
      type: Number,
    },
  },

  data() {
    return {
      bookings: [],
      search: "",
      headers: [
        { text: "User ID", value: "userID" },
        // { text: "Email", value: "email" }, // Not doing for now for privacy concerns
        { text: "Class Name", value: "name" },
        { text: "Points", value: "points" },
        { text: "Start Time", value: "startTime" },
        { text: "Class Detail", value: "classID" },
      ],
    };
  },
  created() {
    this.getBookings();
  },
  methods: {
    async getBookings() {
      this.bookings = (
        await api.get(`/bookings/all/${this.partnerID}`)
      ).bookingsOfPartner;
      console.log("this", this.bookings);
    },
  },
};
</script>
