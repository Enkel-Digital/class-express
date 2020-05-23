<template>
  <v-content id="AddNewStartTime">
    <!-- Select start times in the week -->
    <v-row>
      <v-col style="width: 450px;  auto;">
        <h3 style="color: #455a64;">Start Date</h3>
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
          v-model="selectedDay"
          outlined
        />
      </v-col>

      <!-- Can leave dateEnd as null to indicate no fixed end date yet. -->
      <v-col style="width: 450px;  auto;">
        <h3 style="color: #455a64;">Start time of class</h3>
        <v-time-picker v-model="selectedTime" scrollable ampm-in-title />
      </v-col>

      <v-col>
        <p class="error">{{ errorMessage }}</p>
        <v-btn @click="addNewStartTime" color="primary">
          add new start time
        </v-btn>

        <v-btn @click="reset" color="error">
          Reset selected DateTimes
        </v-btn>
      </v-col>

      <v-col>
        <!-- <h3 style="color: #455a64;">List of Class Start timings</h3> -->
        <h3 style="color: #455a64;">List of Class timings</h3>
        <p style="color: #455a64;">
          *note that this is a weekly recurring schedule
        </p>

        <span v-for="(dateTime, i) in selectedDateTime" :key="i">
          <v-card>
            <v-card-title>
              {{ getDay(dateTime.day) }} - {{ getTime(dateTime.time) }}
            </v-card-title>

            <v-card-action>
              <!-- @todo Uses mouseup event as a hack to prevent mutli click event triggered when mouse down is held -->
              <v-btn icon color="black" @mouseup="removeSelectedDateTime(i)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-action>
          </v-card>
        </span>
      </v-col>
    </v-row>
  </v-content>
</template>

<script>
import moment from "moment";

export default {
  name: "AddNewStartTime",
  props: ["classLengthInMinutes"],
  data() {
    return {
      selectedDay: 1,
      selectedTime: "09:00",
      // @todo Sort the array to order by day and time in asc order
      selectedDateTime: [],
    };
  },
  methods: {
    getDay(dayValue) {
      return {
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
        7: "Sunday",
      }[dayValue];
    },
    getTime(timeValue) {
      timeValue = timeValue.split(":");

      // Convert the timeValue to 12 hour format with am/pm attached
      if (timeValue[0] >= 12) {
        if (timeValue[0] > 12) timeValue[0] -= 12;
        return timeValue.join(":") + " PM";
      } else {
        if (timeValue[0] === 0) timeValue[0] = 12;
        return timeValue.join(":") + " AM";
      }

      // @todo Show the end timing of the class too instead of just start time
      // this.classLengthInMinutes
    },
    addNewStartTime() {
      // Check if this value is repeated
      for (const dateTime of this.selectedDateTime) {
        // If any of them matches/repeats, return to end method.
        if (
          dateTime.day === this.selectedDay &&
          dateTime.time === this.selectedTime
        )
          return;
      }

      this.selectedDateTime.push({
        day: this.selectedDay,
        time: this.selectedTime,
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
