<template>
  <v-responsive>
    <v-card outlined ref="form">
      <v-card-text>
        <h2 style="color: #455a64;" class="text-left font-weight-light">
          CLASS TIMINGS
        </h2>
        <br />

        <v-row>
          <v-col cols="4">
            <v-select
              :items="[
                { text: 'mon', value: 1 },
                { text: 'tues', value: 2 },
                { text: 'wed', value: 3 },
                { text: 'thurs', value: 4 },
                { text: 'fri', value: 5 },
                { text: 'sat', value: 6 },
                { text: 'sun', value: 7 },
              ]"
              label="Day of the week"
              item-color="#60696c"
              color="#60696c"
              v-model="selectedDay"
            />
          </v-col>

          <!-- <v-col cols="12">
            <v-menu
              ref="menu"
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="selectedTime"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="selectedTime"
                  label="Start Time"
                  readonly
                  color="#60696c"
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-time-picker
                v-if="menu2"
                v-model="selectedTime"
                color="#60696c"
                full-width
                @click:minute="$refs.menu.save(selectedTime)"
              />
            </v-menu>
          </v-col> -->

          <!-- 2 seperate textfields and columns for entering hour and minute -->
          <!-- @todo Trim these inputs to ensure no space -->
          <v-col cols="2">
            <v-text-field
              v-model="selectedHour"
              :rules="rules.selectedHour"
              label="Hour"
              color="#60696c"
              required
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="selectedMinute"
              :rules="rules.selectedMinute"
              label="Minute"
              color="#60696c"
              required
            />
          </v-col>
          <v-col cols="4">
            <v-switch
              v-model="selectedAmPeriod"
              :label="selectedAmPeriod ? 'AM' : 'PM'"
              color="#60696c"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="8">
            <v-btn @click="reset" rounded outlined color="red">
              Reset all timings
            </v-btn>
          </v-col>

          <v-col cols="4">
            <v-btn @click="addNewStartTime" outlined rounded color="green">
              Add new start time
            </v-btn>
          </v-col>
        </v-row>

        <br />

        <!-- @todo Perhaps show a calendar instead of individual time slots -->
        <v-row>
          <v-col cols="12">
            <h3 style="color: #455a64;" class="text-left font-weight-light">
              LIST OF CLASS TIMINGS
            </h3>
            <p>
              *note that this is a weekly recurring schedule
            </p>
            <span v-for="(dateTime, i) in selectedDateTime" :key="i">
              <v-card max-width="8em" dense outlined>
                <v-list-item one-line>
                  <v-list-item-content>
                    <v-list-item-subtitle>
                      {{ getDay[dateTime.day] }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      {{ getTime(dateTime) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-card-actions class="justify-left">
                  <v-btn
                    text
                    class="overline pa-0"
                    color="black"
                    @mouseup="removeSelectedDateTime(i)"
                  >
                    delete
                  </v-btn>
                </v-card-actions>
              </v-card>
            </span>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-responsive>
</template>

<script>
// @todo Rename this to SetClassTiming component, then move start and end date from add new class into here

import moment from "moment";

export default {
  name: "AddNewStartTime",
  props: ["classLengthInMinutes"],
  data() {
    return {
      // @todo Better naming
      menu2: false,

      // Pre computed values from classLengthInMinutes to use for calculating end time
      classHour: Math.trunc(this.classLengthInMinutes / 60),
      classMinutes: this.classLengthInMinutes % 60,

      // Default selected week day to monday
      selectedDay: 1,

      selectedHour: "",
      selectedMinute: "",
      selectedAmPeriod: false,

      // @todo Sort the array to order by day and time in asc order
      selectedDateTime: [],

      rules: {
        selectedHour: [
          (hour) =>
            (hour && hour > 0 && hour < 13) ||
            "Invalid, enter a number between 1 and 12",
        ],
        selectedMinute: [
          (min) =>
            (min && min >= 0 && min < 60) ||
            "Invalid, enter a number between 0 and 59",
        ],
      },

      // Simple object to map a int to week day
      getDay: {
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
        7: "Sunday",
      },
    };
  },
  methods: {
    // @todo change all these to use moments
    getTime(selectedDateTime) {
      const startTime = `${selectedDateTime.hour}:${
        selectedDateTime.minute < 10
          ? "0" + selectedDateTime.minute
          : selectedDateTime.minute
      } 
      ${selectedDateTime.amPeriod ? "AM" : "PM"}`;

      const endTime = ``;

      return `${startTime} - ${endTime}`;
    },
    addNewStartTime() {
      // Check if this value is repeated
      // @todo Actually no, should allow multi classes at the same time
      // for (const dateTime of this.selectedDateTime) {
      //   // If any of them matches/repeats, return to end method.
      //   if (
      //     dateTime.day === this.selectedDay &&
      //     dateTime.time === this.selectedTime
      //   )
      //     return;
      // }

      this.selectedDateTime.push({
        day: this.selectedDay,
        hour: this.selectedHour,
        minute: this.selectedMinute,
        amPeriod: this.selectedAmPeriod,
      });
    },
    removeSelectedDateTime(index) {
      console.log("index", index);
      this.selectedDateTime.splice(index, 1);
    },
    reset() {
      // Reset the selected dateTime array
      this.selectedDateTime = [];
    },
  },
};
</script>
