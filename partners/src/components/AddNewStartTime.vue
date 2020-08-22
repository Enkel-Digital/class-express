<template>
  <!-- <v-main id="AddNewStartTime"> -->
  <!-- Select start times in the week -->
  <!-- <v-main id="AddNewStartTime"> -->
  <v-responsive>
    <v-card outlined ref="form">
      <v-card-text>
        <h2 style="color: #455a64;" class="text-left font-weight-light">
          CLASS TIMINGS
        </h2>
        <br />

        <!-- <br /> -->
        <v-row>
          <v-col cols="12" sm="4">
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
              height="1.1em"
              v-model="selectedDay"
            />
          </v-col>

          <!-- <h3 style="color: #455a64;" class="text-left font-weight-light">
          START TIME
        </h3> -->
          <v-col cols="12" sm="8">
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
                  label="Select Class Start Time"
                  prepend-icon="mdi-clock-outline"
                  readonly
                  color="#60696c"
                  height="1.1em"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="menu2"
                v-model="selectedTime"
                color="#60696c"
                full-width
                @click:minute="$refs.menu.save(selectedTime)"
              ></v-time-picker>
            </v-menu>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="6">
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
                    <v-list-item-subtitle>{{
                      getDay(dateTime.day)
                    }}</v-list-item-subtitle>
                    <v-list-item-subtitle>
                      {{ getTime(dateTime.time) }}</v-list-item-subtitle
                    >
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

          <v-col cols="12" sm="6">
            <p class="error">{{ errorMessage }}</p>
            <v-btn
              class="ma-2"
              @click="addNewStartTime"
              outlined
              rounded
              width="15em"
              color="#546E7A"
            >
              Add new start time</v-btn
            >

            <v-btn
              class="ma-2"
              @click="reset"
              width="15em"
              rounded
              outlined
              color="#546E7A"
            >
              Reset all timings</v-btn
            >
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-responsive>

  <!-- </v-main> -->
</template>

<script>
import moment from "moment";

export default {
  name: "AddNewStartTime",
  props: ["classLengthInMinutes"],
  data() {
    return {
      menu2: false,
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
<style scoped>
.text {
  font-size: 1.1em;
}
.v-text-field input {
  font-size: 1.1em;
}
.v-label input {
  font-size: 1.1em;
}
.class-card {
  display: inline-block;
  margin-bottom: 0.5em;
  font-size: 1.1em;

  margin-top: 0.5em;
}
</style>
