<template>
  <v-content id="AddClasses">
    <br />
    <v-form ref="form" v-model="valid" lazy-validation>
      <h2 style="color: #455a64;">Add New Class</h2>
      <v-container>
        <v-row>
          <v-col cols="15" sm="6" md="5">
            <v-text-field
              :rules="nameRules"
              label="Class Name"
              required
              outlined
            ></v-text-field>
          </v-col>

          <v-col cols="15" sm="6" md="3">
            <v-text-field
              :rules="addressRules"
              label="Address Line 1"
              outlined
              required
            ></v-text-field>
          </v-col>
          <v-col cols="15" sm="6" md="3">
            <v-text-field label="Address Line 2" outlined></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="15" sm="6" md="5">
            <v-file-input
              v-model="files"
              color="deep-blue accent-4"
              counter
              multiple
              label="Class Images"
              placeholder="Click here to select your files"
              prepend-icon="mdi-camera"
              outlined
              :show-size="1000"
            ></v-file-input>
          </v-col>

          <v-col cols="15" sm="6" md="2">
            <v-text-field
              :rules="addressRules"
              label="Unit No. (eg. 01-02)"
              outlined
              required
            ></v-text-field>
          </v-col>
          <v-col cols="15" sm="6" md="2">
            <v-text-field
              :rules="addressRules"
              label="Postal Code"
              outlined
              required
            ></v-text-field>
          </v-col>
          <v-col cols="15" sm="6" md="2">
            <v-text-field
              :rules="addressRules"
              label="Country"
              outlined
              required
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="15" sm="6" md="5">
            <v-textarea
              v-autofocus
              type="text"
              v-model="description"
              rows="4"
              placeholder="Enter class description"
              no-resize
              outlined
              required
            />
          </v-col>

          <v-col cols="10" sm="6" md="3">
            <v-checkbox
              v-model="checkbox"
              :label="`Allow walk-in (${checkbox.toString()})`"
            ></v-checkbox>
            <!-- <v-checkbox v-model="checkbox" :label="`Recurring (${checkbox.toString()})`"></v-checkbox> -->
          </v-col>
        </v-row>

        <v-row>
          <v-col style="width: 300px; flex: 0 1 auto;">
            <h3 style="color: #455a64;">Start</h3>
            <v-time-picker
              v-model="start"
              :max="end"
              full-width
              color="#455A64"
            ></v-time-picker>
          </v-col>

          <v-col style="width: 300px; flex: 0 1 auto;">
            <h3 style="color: #455a64;">End</h3>
            <v-time-picker
              v-model="end"
              :min="start"
              full-width
              color="#455A64"
            ></v-time-picker>
          </v-col>

          <v-col style="width: 900px; flex: 0 1 auto;">
            <h3 style="color: #455a64;">Date</h3>
            <v-date-picker
              v-model="date"
              full-width
              :landscape="$vuetify.breakpoint.smAndUp"
              class="mt-4"
              color="#455A64"
            ></v-date-picker>
          </v-col>
        </v-row>

        <br />
        <v-row>
          <v-col cols="15" sm="6" md="1">
            <v-btn depressed large @click="validate">Add Class</v-btn>
          </v-col>

          <v-col cols="15" sm="6" md="1">
            <v-btn depressed large @click="reset">Reset Form</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-content>
</template>

<script>
export default {
  data: () => ({
    time: "11:15",
    date: new Date().toISOString().substr(0, 10),
    checkbox: true,
    valid: true,
    name: "",
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 20) || "Please fill is the required space",
    ],
    rules: [
      (value) =>
        !value ||
        value.size < 2000000 ||
        "Avatar size should be less than 2 MB!",
    ],
    addressRules: [(v) => !!v || "Please fill is the required space"],
  }),
  methods: {
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>

<style scoped>
#AllClasses {
  margin: 4em;
  margin-top: 2em;

  text-align: left;
}
.v-text-field input {
  font-size: 1.2em;
}

.v-input {
  font-size: 1.2em;
}
</style>
