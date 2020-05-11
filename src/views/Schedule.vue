<template>
  <v-content class="ClassDetails">
    <v-app-bar app color="white" flat fixed>
      <BackBtn />

      <v-spacer />

      <h3>{{ name }}</h3>

      <v-spacer />

      <!-- @todo Change this to show how many points you are left. Use a points icon component -->
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

import { mapMutations, mapActions } from "vuex";
import BackBtn from "@/components/BackBtn";

export default {
  name: "schedule",
  components: {
    BackBtn
  },
  created() {
    if (this.classID === undefined && this.partnerID === undefined)
      throw new Error("Missing Schedule view props");

    // Call action to fetch schedule of this class
    if (this.classID)
      this.$store.dispatch("classes/getSchedule", { classID: this.classID });
    else if (this.partnerID)
      this.$store.dispatch("classes/getSchedule", {
        partnerID: this.partnerID
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
      // Classes is static via the data function as we do not want its reactivity
      name: this.classID // @todo dont use ternary, since classID can be 0
        ? this.$store.state.classes.classes[this.classID].name
        : this.$store.state.classes.partners[this.partnerID].name,
      tabs,
      origStartOfDay
    };
  },
  computed: {
    schedule() {
      if (this.classID) return this.$store.state.classes.schedule[this.classID];
      else if (this.partnerID)
        // @todo Change this to partner schedule
        return this.$store.state.classes.schedule[this.partnerID];
      else return false;
    }
  },
  methods: {
    ...mapMutations("classes", ["selectSchedule"]),
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
    }
  }
};
</script>
