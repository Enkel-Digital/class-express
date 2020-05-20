<template>
  <v-content id="AddClasses">
    <br />
    <v-form ref="form" v-model="valid" lazy-validation>
      <h2 style="color: #455a64;">Add New Class</h2>
      <v-container>
        <v-row>
          <v-col cols="15" sm="6" md="5">
            <v-text-field
              v-model="clas.name"
              :rules="nameRules"
              label="Class Name"
              required
              outlined
            />
          </v-col>

          <v-col cols="15" sm="6" md="3">
            <v-text-field
              v-if="changeLocation"
              :rules="addressRules"
              label="Address Line 1"
              outlined
              required
            />
          </v-col>
          <v-col cols="15" sm="6" md="3">
            <v-text-field
              v-if="changeLocation"
              label="Address Line 2"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="15" sm="6" md="5">
            <v-file-input
              v-model="pictures"
              color="deep-blue accent-4"
              counter
              multiple
              label="Class Images"
              placeholder="Click here to select your pictures"
              prepend-icon="mdi-camera"
              outlined
              :show-size="1000"
            ></v-file-input>
          </v-col>

          <v-col cols="15" sm="6" md="2">
            <v-text-field
              v-if="changeLocation"
              :rules="addressRules"
              label="Unit No. (eg. 01-02)"
              outlined
              required
            ></v-text-field>
          </v-col>
          <v-col cols="15" sm="6" md="2">
            <v-text-field
              v-if="changeLocation"
              :rules="addressRules"
              label="Postal Code"
              outlined
              required
            ></v-text-field>
          </v-col>
          <v-col cols="15" sm="6" md="2">
            <v-text-field
              v-if="changeLocation"
              :rules="addressRules"
              label="Country"
              outlined
              required
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- @todo Sanitize HTML input to prevent script injection attacks -->
        <v-row>
          <v-col cols="15" sm="6" md="5">
            <v-textarea
              v-autofocus
              type="text"
              v-model="clas.description"
              rows="4"
              placeholder="Enter class description"
              no-resize
              outlined
              required
            />
          </v-col>
          <v-col cols="10" sm="6" md="3">
            <v-checkbox
              v-model="addLocationCheckbox"
              label="Add Location"
            ></v-checkbox>
            <!-- <v-checkbox v-model="checkbox" :label="`Recurring (${checkbox.toString()})`"></v-checkbox> -->
          </v-col>

          <v-col cols="10" sm="6" md="3">
            <v-checkbox
              v-model="allowWalkinCheckbox"
              label="Allow walk in registrations"
            ></v-checkbox>
            <!-- <v-checkbox v-model="checkbox" :label="`Recurring (${checkbox.toString()})`"></v-checkbox> -->
          </v-col>
        </v-row>

        <!-- Time related components -->

        <!-- Length of the class -->
        <v-text-field
          :rules="classLengthRules"
          v-model="clas.length"
          type="number"
          label="Class length in minutes"
          outlined
          required
        />

        <span>
          length: {{ Math.trunc(clas.length / 60) }} hr
          {{ clas.length % 60 }} mins
        </span>

        <!-- Date start and End date -->
        <v-row>
          <v-col style="width: 450px;  auto;">
            <h3 style="color: #455a64;">Class Start Date</h3>
            <v-date-picker
              v-model="clas.dateStart"
              class="mt-4"
              color="#455A64"
            />
          </v-col>

          <!-- Can leave dateEnd as null to indicate no fixed end date yet. -->
          <v-col style="width: 450px;  auto;">
            <h3 style="color: #455a64;">Class End Date</h3>
            <v-date-picker
              v-model="clas.dateEnd"
              class="mt-4"
              color="#455A64"
            />
          </v-col>
        </v-row>

        <!--
          @todo Implement start time from the weekly calendar view
          Show a calendar and allow user to click arbitrary number of times as start of classes
          Allow partners to create overlapping start times
        -->

        <!-- @todo Create scheduler component to reuse in edit class -->
        <!-- <v-row>
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
        </v-row> -->

        <br />
        <v-row>
          <v-col cols="15" sm="6" md="1">
            <v-btn color="error" depressed large @click="reset">
              Reset Form
            </v-btn>
          </v-col>

          <v-spacer />

          <v-col cols="15" sm="6" md="1">
            <v-btn color="primary" depressed large @click="addClass">
              Add Class
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-content>
</template>

<script>
export default {
  data() {
    // @todo Nest the class details properties to allow for easier submitting in addClass method
    return {
      clas: {
        name: null,
        pictures: null,
        description: null,
        length: null,
        dateStart: null,
        dateEnd: null,
      },
      changeLocation: false,
      addLocationCheckbox: false,
      allowWalkinCheckbox: false,
      valid: null,
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
    };
  },
  methods: {
    addClass() {
      if (!this.validate()) return;

      this.$store.dispatch("classes/newClass", this.clas);
    },
    validate() {
      return this.$refs.form.validate();
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
