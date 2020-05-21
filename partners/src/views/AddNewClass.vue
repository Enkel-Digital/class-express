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

          <v-col v-if="addLocationCheckbox" cols="15" sm="6" md="3">
            <v-text-field
              v-if="changeLocation"
              :rules="addressRules"
              label="Address Line 1"
              outlined
              required
            />
          </v-col>
          <v-col v-if="addLocationCheckbox" cols="15" sm="6" md="3">
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
              v-model="clas.pictures"
              color="deep-blue accent-4"
              counter
              multiple
              label="Class Images"
              placeholder="Upload pictures of the class"
              prepend-icon="mdi-camera"
              outlined
              :show-size="1000"
            ></v-file-input>
          </v-col>

          <v-col v-if="addLocationCheckbox" cols="15" sm="6" md="2">
            <v-text-field
              v-if="changeLocation"
              :rules="addressRules"
              label="Unit No. (eg. 01-02)"
              outlined
              required
            ></v-text-field>
          </v-col>
          <v-col v-if="addLocationCheckbox" cols="15" sm="6" md="2">
            <v-text-field
              v-if="changeLocation"
              :rules="addressRules"
              label="Postal Code"
              outlined
              required
            ></v-text-field>
          </v-col>
          <v-col v-if="addLocationCheckbox" cols="15" sm="6" md="2">
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
            <p>
              You are allowed to use most valid HTML to format your description.
              Script tags and others are not allowed.
            </p>
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
              label="Choose external location"
            ></v-checkbox>
          </v-col>

          <v-col cols="10" sm="6" md="3">
            <v-checkbox
              v-model="allowWalkinCheckbox"
              label="Allow walk in registrations"
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-row>
          <!--
            @todo Add input field for entering the category of this new class
            @todo Add input field for keying meta tags for new class
          -->
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
            <p>Leave empty to specify no fixed end date for this class</p>
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
/**
 * @todo Update the layout to use cards to group items together rather than fixed rows and columns
 * @todo Remove all "v-if="addLocationCheckbox" checks and group them into a single card
 * @todo Add rule checking to sanitize the HTML input for description
 */

import moment from "moment";
import cloneDeep from "lodash.clonedeep";

export default {
  data() {
    // @todo Nest the class details properties to allow for easier submitting in addClass method
    return {
      clas: {
        name: null,
        pictures: null,
        description: null,
        length: null,
        dateStart: moment().format("YYYY-MM-DD"), // Create date in local timezone for today in the format of e.g. "2020-05-21"
        dateEnd: null,
      },
      changeLocation: true,
      addLocationCheckbox: false,
      allowWalkinCheckbox: false,
      valid: null,
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => (v && v.length <= 20) || "Please fill is the required space",
      ],
      classLengthRules: [
        (length) => !!length || "Length is required",
        (length) => length > 0 || "Cannot have a class of 0 mins or less",
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
    async addClass() {
      if (!this.validate()) return;

      const clas = cloneDeep(this.clas);

      // Convert start date to start of day in UTC timestamp

      /**
       * @note Food for thought
       *
       * When I store it, I convert it to the SGT start of day before converting to UTC
       * 30/5/2020 SGT 12AM ---> 29/5/2020 UTC 4PM
       *
       * When reading in SGT
       * 29/5/2020 UTC 4PM --> 30/5/2020 SGT 12AM
       *
       * However if I read in GMT + 7
       * 29/5/2020 UTC 4PM --> 29/5/2020 SGT 11pm
       *
       * Will this be an issue that needs to be taken care of?
       * Will this affect rrule generation and testing.
       */
      clas.dateStart = moment(clas.dateStart).startOf("day").utc().unix();

      // Only if dateEnd is given, then do we convert it to timestamp
      if (clas.dateEnd)
        clas.dateEnd = moment(clas.dateEnd).startOf("day").utc().unix();

      const classID = await this.$store.dispatch("classes/newClass", clas);
      if (classID)
        this.$router.push({ name: "ClassDetails", params: { classID } });
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
