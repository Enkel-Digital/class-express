<template>
  <v-content class="ClassDetails">
    <v-app-bar app color="white" flat fixed>
      <BackBtn />

      <v-spacer></v-spacer>

      <h3>{{ className }}</h3>

      <v-spacer></v-spacer>

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
import { mapMutations } from "vuex";
import BackBtn from "@/components/BackBtn";

export default {
  name: "schedule",
  components: {
    BackBtn
  },
  created() {
    // Call action to fetch schedule of this class
    this.$store.dispatch("classes/getSchedule", { classID: this.classID });
  },
  props: ["classID"],
  data() {
    // Create default tabs array of 7 element to display 7 dates and prefetch 7 days of schedule
    const tabs = [...Array(7).keys()];

    /** @notice Compute only once but use startOfDay method to clone it as moments are mutable */
    const origStartOfDay = this.moment().startOf("day");

    return {
      // Classes is static via the data function as we do not want its reactivity
      className: this.$store.state.classes.classes[this.classID].name,
      tabs,
      origStartOfDay
    };
  },
  computed: {
    schedule() {
      return this.$store.state.classes.schedule[this.classID];
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
