<template>
  <div class="col-md-12 col-12" align="left">
    <v-card class="mx-auto">
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title class="headline">
            Schedule for Today,
            {{ moment(Date()).format("MMMM Do") }}
          </v-list-item-title>
          <!-- <v-list-item-subtitle>Mon, 12:30 PM, Mostly sunny</v-list-item-subtitle> -->
        </v-list-item-content>
      </v-list-item>

      <v-data-table
        :headers="headers"
        :items="classItem"
        :items-per-page="5"
        class="elevation-1"
      />
      <v-card-actions>
        <v-btn text>Full Report</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { moment } from "vue-moment";

export default {
  name: "schedule-listing-card",
  data() {
    return {
      headers: [
        {
          text: "ClassName",
          align: "start",
          sortable: false,
          value: "itemName",
        },
        { text: "Class Timing (h)", value: "classTiming" },
        { text: "Attendee Count", value: "numAttendees" },
      ],
      classItem: [
        {
          itemIndex: "0",
          itemName: "Begineer Guitar",
          classTiming: "1-3pm",
          numAttendees: "6",
        },
        {
          itemIndex: "1",
          itemName: "Advanced Guitar",
          classTiming: "6-8pm",
          numAttendees: "10",
        },
      ],
    };
  },
};
</script>
