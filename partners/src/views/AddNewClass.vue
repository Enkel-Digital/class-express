<template>
  <v-content id="AddClasses">
    <v-row>
      <v-col cols="12" sm="4">
        <v-card outlined ref="form" v-model="valid">
          <v-card-text>
            <h2 style="color: #455a64;" class="text-left font-weight-light">
              CLASS DETAILS
            </h2>
            <br />

            <v-text-field
              v-model="clas.name"
              :rules="nameRules"
              label="Class Name"
              placeholder="Basic Guitar"
              color="#60696c"
              required
            />

            <v-text-field
              :rules="maxParticipantRules"
              v-model="clas.maxParticipant"
              type="number"
              color="#60696c"
              label="Maximum Number of Participants Per Session"
              placeholder="30"
              required
            />

            <v-file-input
              v-model="clas.pictures"
              color="#60696c"
              counter
              multiple
              height="1.1em"
              label="Class Images"
              placeholder="Select Pictures for Your Class"
              :show-size="1000"
            ></v-file-input>

            <v-combobox
              v-model="clas.classCategory"
              :items="classCategoryList"
              chips
              color="#60696c"
              clearable
              label="Select Your Class Categories"
              multiple
              single-line
            >
              <template v-slot:selection="{ attrs, item, select, selected }">
                <v-chip
                  v-bind="attrs"
                  :input-value="selected"
                  close
                  small
                  @click="select"
                  @click:close="remove(item)"
                >
                  <strong>{{ item }}</strong>
                </v-chip>
              </template>
            </v-combobox>

            <v-text-field
              :rules="classLengthRules"
              v-model="clas.length"
              type="number"
              label="Class Length (minutes)"
              placeholder="120"
              color="#60696c"
              required
            />
            <span>
              length: {{ Math.trunc(clas.length / 60) }} hr
              {{ clas.length % 60 }} mins
            </span>

            <p class="text-left">
              You are allowed to use most valid HTML to format your description.
              Script tags and others are not allowed.
            </p>
            <!-- @todo Sanitize HTML input to prevent script injection attacks -->
            <v-textarea
              v-autofocus
              type="text"
              v-model="clas.description"
              rows="4"
              outlined
              placeholder="Enter Your Class Description"
              no-resize
              color="#60696c"
              required
            />
            <span v-html="sanitizeMessage"></span>

            <v-switch
              v-model="allowWalkinCheckbox"
              label="Allow Walk-in Registrations"
              color="#60696c"
            ></v-switch>

            <v-switch
              v-model="addLocationCheckbox"
              label="Use Non-default External Location"
              color="#60696c"
            ></v-switch>
          </v-card-text>

          <v-expand-transition>
            <div v-show="addLocationCheckbox">
              <v-divider></v-divider>
              <v-col cols="12" sm="12">
                <v-text-field
                  :rules="addressRules"
                  label="Address Line 1"
                  placeholder="123 Peach St"
                  color="#60696c"
                  required
                />

                <v-text-field
                  label="Address Line 2"
                  placeholder=""
                  color="#60696c"
                ></v-text-field>

                <v-text-field
                  :rules="addressRules"
                  label="Unit No."
                  color="#60696c"
                  placeholder="12-02"
                  required
                ></v-text-field>

                <v-text-field
                  :rules="addressRules"
                  label="Postal Code"
                  required
                  placeholder="111222"
                  color="#60696c"
                ></v-text-field>

                <v-text-field
                  :rules="addressRules"
                  label="Country"
                  required
                  color="#60696c"
                  placeholder="Singapore"
                ></v-text-field>
              </v-col>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>

      <v-col cols="12" sm="8">
        <AddNewStartTime :classLengthInMinutes="clas.length" />
      </v-col>

      <v-col cols="12" sm="4">
        <v-card outlined ref="form" v-model="valid">
          <v-card-text>
            <!-- <h2 style="color: #455a64;" class="text-left font-weight-light">
              CLASS START DATE
            </h2> -->
            <v-menu
              v-model="startDateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="clas.dateStart"
                  label="Select Class Start Date"
                  prepend-icon="mdi-calendar-month"
                  color="#60696c"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="clas.dateStart"
                color="#60696c"
                header-color="#60696c"
                event-color="#60696c"
                @input="startDateMenu = false"
              ></v-date-picker>
            </v-menu>

            <!-- <h2 style="color: #455a64;" class="text-left font-weight-light">
              CLASS END DATE
            </h2> -->
            <v-menu
              v-model="endDateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="clas.dateEnd"
                  label="Select Class End Date"
                  prepend-icon="mdi-calendar-month"
                  color="#60696c"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="clas.dateEnd"
                header-color="#60696c"
                color="#60696c"
                event-color="#60696c"
                @input="endDateMenu = false"
              ></v-date-picker>
            </v-menu>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Time related components -->

    <!-- Length of the class -->

    <!-- Select start times in the week -->

    <!-- Date start and End date -->

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
    <v-row class="text-center">
      <v-col cols="12" sm="6">
        <v-btn
          color="#60696c"
          rounded
          width="15em"
          outlined
          depressed
          large
          @click="reset"
        >
          Reset Form
        </v-btn>
      </v-col>

      <v-col cols="12" sm="6">
        <v-btn
          color="#60696c"
          class="white--text text-right"
          rounded
          width="15em"
          depressed
          large
          @click="addClass"
        >
          Add Class
        </v-btn>
      </v-col>
    </v-row>
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
import AddNewStartTime from "@/components/AddNewStartTime";

export default {
  components: {
    AddNewStartTime,
  },
  data() {
    return {
      startDateMenu: false,
      endDateMenu: false,
      classCategoryList: ["tech", "cooking", "lifestyle", "music", "art"],
      clas: {
        name: null,
        pictures: null,
        description: null,
        length: null,
        dateStart: moment().format("YYYY-MM-DD"), // Create date in local timezone for today in the format of e.g. "2020-05-21"
        dateEnd: null,
        maxParticipant: null,
        classCategory: [],
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
      maxParticipantRules: [
        (length) => !!length || "Max participant is required",
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
  computed: {
    sanitizeMessage() {
      return this.$sanitize(this.clas.description);
    },
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
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    remove(item) {
      this.clas.classCategory.splice(this.clas.classCategory.indexOf(item), 1);
      this.clas.classCategory = [...this.clas.classCategory];
    },
  },
};
</script>

<style scoped>
#AddClasses {
  margin: 4em;
  margin-top: 1em;
  /* margin-left: 2em; */
  text-align: left;
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
.text {
  font-size: 1.1em;
}
</style>
