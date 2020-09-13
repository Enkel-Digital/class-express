<template>
  <v-main class="ClassDetails">
    <v-app-bar app color="white" flat fixed>
      <BackBtn />

      <v-spacer />

      <!-- name and class length is displayed together as the length is always the same for class schedule -->
      <h3>
        {{ name }}
        "{{ `${Math.trunc(clas.length / 60)} hrs ${clas.length % 60} mins` }}"
      </h3>
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
        <!-- The line below all the date tabs is created using this divider -->
        <v-divider />

        <v-card
          v-for="(isoTimeString, timestampIndex) in scheduleOfSelectedDate"
          :key="timestampIndex"
          :to="{
            name: 'ClassDetails',
            params: { classID: classID, selectedTime: isoTimeString },
          }"
          flat
          tile
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="mb-1">
                <!-- 100% width table for consistent spacing regardless of the number's character width -->
                <table style="width: 100%">
                  <tr>
                    <!-- If using unix seconds instead of iso 8601 time string -->
                    <!-- <th>{{ moment.unix(timestamp).format("h:mm A") }}</th> -->
                    <!-- @todo Might change to use Location aware format -->
                    <!-- <th>{{ moment(isoTimeString).format("LT") }}</th> -->
                    <th>{{ moment(isoTimeString).format("h:mm A") }}</th>
                    <th>-</th>
                    <th>
                      {{
                        moment(isoTimeString)
                          .add(clas.length, "minutes")
                          .format("h:mm A")
                      }}
                    </th>
                  </tr>
                </table>
              </v-list-item-title>
            </v-list-item-content>

            <v-list-item-content>
              <v-list-item-subtitle>
                <!-- @todo class instructor if any -->

                <span style="margin-right: 1em">{{ clas.name }}</span>

                <!-- @todo The purpose of showing points here is because we might support variable point system in the future -->
                <span style="font-weight: bold">{{ clas.points }}</span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider />
        </v-card>

        <!-- Show no schedule available section if schedule of selected date is not loaded yet or if there is none -->
        <div v-if="!scheduleOfSelectedDate || !scheduleOfSelectedDate.length">
          <!--  -->
          Nothing here
        </div>
      </v-tab-item>
    </v-tabs>
  </v-main>
</template>

<script>
/**
 * Notes on the representation of time:
 * - This uses both Unix seconds and iso 8061 time strings in utc
 * - The reason is because it is easier and more standardized to use unix seconds in our system.
 * - However for scheduling, we are using the rrule library in the backend, which means that it returns iso time strings
 * - SO, instead of processing the iso time strings on the backend, we will instead take them as if and use moment lib to transform
 * - This might change in the future for consistency sake, but will only be decided once scheduling and rrule backend is complete.
 */

import { mapState } from "vuex";
import BackBtn from "@/components/BackBtn";

export default {
  name: "ClassSchedule",
  components: {
    BackBtn,
  },
  props: ["classID"],
  created() {
    if (!this.classID) throw new Error("Missing Schedule view props");

    // Call action to fetch schedules and load them into vuex before they are read/passed in to this component as computed properties
    this.$store.dispatch("classes/getClassSchedule", {
      classID: this.classID,
    });
  },
  data() {
    /** @notice Compute only once but use startOfDay method to clone it as moments are mutable */
    const origStartOfDay = this.moment().startOf("day");

    return {
      // Name is static via data function as we do not need it to be reactive as a computed property
      name: this.$store.state.classes.classes[this.classID].name,
      // Allow users to view classes up to 1 month from today, with 1 day as 1 tab
      // Like points, instead of repeating on the same day every month, just assume a month === 30days
      tabs: [...Array(30).keys()],
      // A unix timestamp used as the date cursor, defaults to today in the user's timezone
      dateCursor: origStartOfDay.unix(),
      origStartOfDay,
    };
  },
  computed: {
    ...mapState("classes", ["classes"]),
    clas() {
      return this.$store.state.classes.classes[this.classID];
    },
    // Schedule of class or partner following the dateCursor
    scheduleOfSelectedDate() {
      // Uses an optional chaining operator as the classID key may not have an object loaded onto it yet
      return this.$store.state.classes.classSchedules[this.classID]?.[
        this.dateCursor
      ];
    },
  },
  methods: {
    daysFromToday(days) {
      return this.origStartOfDay.clone().add(days, "days");
    },
    /**
     * Load schedule as user scrolls/swipes/change-tabs to view more
     * @param {Number} dateCursorJump Number of 0 to x, representing which tab is pressed, where 0 is the first tab
     */
    dateCursorChanged(dateCursorJump) {
      // console.log("dateCursor", dateCursor);

      // Add the jump number as number of days to the start date and set as the date cursor
      this.dateCursor = this.origStartOfDay
        .clone()
        .add(dateCursorJump, "days")
        .unix();

      this.$store.dispatch("classes/getClassSchedule", {
        classID: this.classID,
        dateCursor: this.dateCursor,
      });

      // Have a check to see when the points period ends and notify user that they cannot book classes beyond the current points period
      // Or should we allow them to book, and deduct straight away from their nxt month one?
      // I think at first, use method 1 then in prod then build method 2
    },
  },
};
</script>

<style scoped>
/* Prevent the time values in the table columns from being bolded */
th {
  font-weight: normal;
}
</style>
