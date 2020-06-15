<template>
  <v-content class="ClassDetails">
    <v-app-bar app color="white" flat fixed>
      <BackBtn />

      <v-spacer />
      <h3>{{ name }}</h3>
      <v-spacer />
    </v-app-bar>

    <!-- @todo Remove the arrows and the space left by the left arrow -->
    <v-tabs
      @change="dateCursorChanged"
      background-color="white"
      slider-color="black"
      :show-arrows="true"
    >
      <v-tab v-for="i in tabs" :key="i">
        {{
          daysFromToday(i).format("ddd") + " " + daysFromToday(i).format("D")
        }}
      </v-tab>

      <v-tab-item v-for="i in tabs" :key="i">
        <v-divider />

        <span v-for="timestamp in sortedScheduleTimestamps" :key="timestamp">
          <v-card
            v-for="(classID, i) in scheduleOfSelectedDate[timestamp]"
            :key="i"
            :set="(clas = classes[classID])"
            :to="{
              name: 'ClassDetails',
              params: { classID: classID, selectedTime: timestamp },
            }"
            flat
            tile
          >
            <v-list-item>
              <v-list-item-content>
                <!-- <p class="overline">Time</p> -->

                <v-list-item-title class="mb-1">
                  <!-- Location aware format -->
                  <!-- {{ moment.unix(timestamp).format("LT") }} -->
                  <!-- Custom format -->
                  {{ moment.unix(timestamp).format("h:mm A") }}

                  <br />

                  <span :set="(hr = Math.trunc(clas.length / 60))">
                    <span v-if="hr">{{ hr }} hr</span>
                  </span>

                  <span :set="(mins = clas.length % 60)">
                    <span v-if="mins">{{ mins }} mins</span>
                  </span>
                </v-list-item-title>
              </v-list-item-content>

              <v-list-item-content>
                <v-list-item-subtitle>
                  <!-- class instructor if any -->
                  {{ clas.name }}
                  <span style="font-weight: bold;">{{ clas.points }}</span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider />
          </v-card>
        </span>
      </v-tab-item>
    </v-tabs>
  </v-content>
</template>

<script>
/**
 * schedule view have 2 functions.
 * 1. Show all schedules of all classes by that partner.
 *   - triggered by clicking schedule button in partner details screen
 * 2. Show all schedules of a selected class
 *   - triggered by clicking schedule button in class details screen
 *
 * always show loading icon the turning thing before we load the schedule in.
 */

import { mapState } from "vuex";
import BackBtn from "@/components/BackBtn";

export default {
  name: "schedule",
  components: {
    BackBtn,
  },
  props: ["classID", "partnerID"],
  created() {
    if (this.classID === undefined && this.partnerID === undefined)
      throw new Error("Missing Schedule view props");

    // Call action to fetch schedules and load them into vuex before they are read/passed in to this component as computed properties
    if (this.classID)
      this.$store.dispatch("classes/getClassSchedule", {
        classID: this.classID,
      });
    else if (this.partnerID)
      this.$store.dispatch("classes/getPartnerSchedule", {
        partnerID: this.partnerID,
      });
  },
  data() {
    // Allow users to view classes up to 1 month from today, with 1 day as 1 tab
    // Like points, instead of repeating on the same day every month, just assume a month === 30days
    const tabs = [...Array(30).keys()];

    /** @notice Compute only once but use startOfDay method to clone it as moments are mutable */
    const origStartOfDay = this.moment().startOf("day");

    return {
      // Name is static via data function as we do not need it to be reactive as a computed property
      name: this.classID
        ? this.$store.state.classes.classes[this.classID].name
        : this.$store.state.classes.partners[this.partnerID].name,
      tabs,
      origStartOfDay,
      // A unix timestamp used as the date cursor, defaults to today in the user's timezone
      dateCursor: this.moment().startOf("day").unix(),
    };
  },
  computed: {
    ...mapState("classes", ["classes"]),
    schedule() {
      if (this.classID)
        return this.$store.state.classes.schedule.class[this.classID];
      else if (this.partnerID)
        return this.$store.state.classes.schedule.partner[this.partnerID];
      else return undefined; // Return undefined if neither values are present
    },
    // Schedule of class or partner following the dateCursor
    scheduleOfSelectedDate() {
      return this.schedule[this.dateCursor];
    },
    // This one sorts the timestamp of a SINGLE DAY
    sortedScheduleTimestamps() {
      // Create a new sorted array from earliest to latest timestamp
      return Object.keys(this.scheduleOfSelectedDate).sort((a, b) => a - b);
    },
  },
  methods: {
    daysFromToday(days) {
      return this.origStartOfDay.clone().add(days, "days");
    },
    // Load schedule as user scrolls/swipes to view more
    dateCursorChanged(dateCursor) {
      // Have a check to see when the points period ends and notify user that they cannot book classes beyond the current points period
      // Or should we allow them to book, and deduct straight away from their nxt month one?
      // I think at first, use method 1 then in prod then build method 2
      // this.$store.dispatch("classes/getSchedule", {
      //   classID: this.classID,
      //   // ,dates
      // });
    },
  },
};
</script>
