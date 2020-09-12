<template>
  <v-main class="ClassDetails">
    <v-app-bar app color="white" flat fixed>
      <BackBtn />

      <v-spacer />
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
        <!-- {{ i }} -->
        <!-- Use utc to deal with everything? Or local time depending on the location/timezone of the user? -->
        <!-- Use this as the ID for everything. -->
        <!-- {{ daysFromToday(i).unix() }} -->
        <!--{{
              daysFromToday(i).format("ddd") +
              " " +
              daysFromToday(i).format("D")
            }} -->
        <!-- Perhaps the elements of tabs should be timestamp alr, so we can use it directly -->
        <!-- {{ schedule[dateCursor(i)] }} -->
        <!-- 
          generate the dates on the frontend since always the same
          then use the ts to ping server for the schedule.
        -->

        <v-divider />

        <v-card
          v-for="(timestamp, timestampIndex) in scheduleOfSelectedDate"
          :key="timestampIndex"
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

                <table style="width: 100%">
                  <tr>
                    <th>{{ moment.unix(timestamp).format("h:mm A") }}</th>
                    <th>-</th>
                    <th>
                      {{
                        moment
                          .unix(timestamp)
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
      </v-tab-item>
    </v-tabs>
  </v-main>
</template>

<script>
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
    // Allow users to view classes up to 1 month from today, with 1 day as 1 tab
    // Like points, instead of repeating on the same day every month, just assume a month === 30days
    const tabs = [...Array(30).keys()];

    /** @notice Compute only once but use startOfDay method to clone it as moments are mutable */
    const origStartOfDay = this.moment().startOf("day");

    return {
      // Name is static via data function as we do not need it to be reactive as a computed property
      name: this.$store.state.classes.classes[this.classID].name,
      tabs,
      origStartOfDay,
      // A unix timestamp used as the date cursor, defaults to today in the user's timezone
      dateCursor: this.moment().startOf("day").unix(),
    };
  },
  computed: {
    ...mapState("classes", ["classes"]),
    clas() {
      return this.$store.state.classes.classes[this.classID];
    },
    schedule() {
      return this.$store.state.classes.schedule.class[this.classID];
    },
    // Schedule of class or partner following the dateCursor
    scheduleOfSelectedDate() {
      return this.schedule[this.dateCursor];
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

<style scoped>
/* Prevent the time values in the table columns from being bolded */
th {
  font-weight: normal;
}
</style>
