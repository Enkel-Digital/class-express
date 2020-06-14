<template>
  <v-content class="ClassDetails">
    <v-app-bar app color="white" flat fixed>
      <BackBtn />

      <v-spacer />

      <h3>{{ name }}</h3>

      <v-spacer />

      <!-- @todo Change this to show how many points you have left. Use a points icon component like MapImage -->
      <v-btn icon>
        <v-icon>mdi-share</v-icon>
      </v-btn>
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
        <v-card flat tile>
          <v-card-text>
            {{ i }}
            <br />
            {{ daysFromToday(i).unix() }}
            <br />
            {{
              daysFromToday(i).format("ddd") +
              " " +
              daysFromToday(i).format("D")
            }}
          </v-card-text>
        </v-card>
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
 *   Use the global loading component via the store.
 */

import BackBtn from "@/components/BackBtn";

export default {
  name: "schedule",
  components: {
    BackBtn,
  },
  created() {
    if (this.classID === undefined && this.partnerID === undefined)
      throw new Error("Missing Schedule view props");

    // Call action to fetch schedules and load them into vuex before they are read/passed in to this component as computed properties
    // @todo Change naming to getClassSchedule and getPartnerSchedule instead of combining them
    if (this.classID)
      this.$store.dispatch("classes/getSchedule", { classID: this.classID });
    else if (this.partnerID)
      this.$store.dispatch("classes/getSchedule", {
        partnerID: this.partnerID,
      });
  },
  props: ["classID", "partnerID"],
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
    };
  },
  computed: {
    schedule() {
      if (this.classID)
        return this.$store.state.classes.schedule.class[this.classID];
      else if (this.partnerID)
        return this.$store.state.classes.schedule.partner[this.partnerID];
      else return undefined; // Return undefined if neither values are present
    },
  },
  methods: {
    daysFromToday(days) {
      return this.origStartOfDay.clone().add(days, "days");
    },
    // Load schedule as user scrolls/swipes to view more
    dateCursorChanged(dateCursor) {
      const numOfScheduleToBuffer = dateCursor + 7 - this.tabs.length;
      if (numOfScheduleToBuffer < 1) return; // Skip when user moves dateCursor backwards in time

      const dates = [];

      // Load 1 week more of schedules from selected date's cursor
      for (const i of Array(numOfScheduleToBuffer).keys()) {
        this.tabs.push(this.tabs.length);
        dates.push();
      }

      this.$store.dispatch("classes/getSchedule", { classID: this.classID });
    },
  },
};
</script>
