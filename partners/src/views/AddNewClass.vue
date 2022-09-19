<template>
  <v-main id="AddClasses">
    <v-row>
      <v-col cols="12" sm="4">
        <v-card outlined ref="form" v-model="valid">
          <v-card-text>
            <h2 style="color: #455a64" class="text-left font-weight-light">
              CLASS DETAILS
            </h2>
            <br />

            <!-- @todo Show the SGT somewhere on this page -->

            <v-text-field
              v-autofocus
              v-model="clas.name"
              :rules="nameRules"
              label="Name"
              placeholder="E.g. Basic Guitar"
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

            <!-- @todo Implement multi picture uploads? -->
            <!-- @todo Add a section to preview the images first, and allow user to sort them in order before uploading -->
            <v-file-input
              v-model="clas.pictures"
              color="#60696c"
              counter
              multiple
              label="Class Images"
              placeholder="Select Pictures for Your Class"
              :show-size="1000"
            />

            <!-- @todo Why single-line attr.? -->
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
            <div style="margin-bottom: 2em">
              length: {{ Math.trunc(clas.length / 60) }} hr
              {{ clas.length % 60 }} mins
            </div>

            <v-textarea
              label="Description"
              type="text"
              @change="sanitized = false"
              v-model="clas.description"
              rows="4"
              outlined
              placeholder="Give your class a Description"
              no-resize
              color="#60696c"
              required
            />

            <p class="text-left">
              You are allowed to use most valid HTML to format your description.
              Script tags and others are not allowed.
            </p>

            <p>
              Below is the how your text will look like, click the confirm
              button to proceed.
            </p>

            <span
              v-if="!sanitized && clas.description != null"
              v-html="sanitizeMessage"
            >
              Above
            </span>

            <br v-if="!sanitized && clas.description != null" />
            <br v-if="!sanitized && clas.description != null" />

            <v-btn
              v-if="!sanitized"
              class="ma-2 white--text"
              @click="replaceMessage"
              color="#60696c"
              block
            >
              confirm html
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="8">
        <AddNewStartTime :classLengthInMinutes="clas.length" />
      </v-col>

      <v-col cols="12" sm="4">
        <v-card outlined ref="form" v-model="valid">
          <v-card-text>
            <v-switch
              v-model="clas.allowWalkin"
              label="Allow Walk-in Registrations"
              color="#60696c"
            />

            <v-switch
              v-model="addLocationCheckbox"
              label="Use different location other then your registered business location"
              color="#60696c"
            />
          </v-card-text>
          <v-expand-transition>
            <div v-show="addLocationCheckbox">
              <v-divider />
              <v-col cols="12" sm="12">
                <v-text-field
                  :rules="addressRules"
                  label="Address Line 1"
                  placeholder="123 Peach St"
                  color="#60696c"
                  required
                />

                <v-text-field label="Address Line 2" color="#60696c" />

                <v-text-field
                  :rules="addressRules"
                  label="Unit No."
                  color="#60696c"
                  placeholder="E.g. #12-02"
                  required
                />

                <v-text-field
                  :rules="addressRules"
                  label="Postal Code"
                  required
                  placeholder="E.g. 111222"
                  color="#60696c"
                />

                <!-- @todo Change this to show singapore by default, and only allow fixed countries where user is not allowed to enter arbitrary strings -->
                <v-text-field
                  :rules="addressRules"
                  label="Country"
                  required
                  color="#60696c"
                  placeholder="Singapore"
                />
              </v-col>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card outlined ref="form" v-model="valid">
          <v-card-text>
            <v-menu
              v-model="showStartDateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="clas.dateStart"
                  label="Class Start Date"
                  prepend-icon="mdi-calendar-month"
                  color="#60696c"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="clas.dateStart"
                color="#60696c"
                header-color="#60696c"
                event-color="#60696c"
                @input="showStartDateMenu = false"
              />
            </v-menu>

            <v-menu
              v-model="showEndDateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="clas.dateEnd"
                  label="End Date (optional)"
                  prepend-icon="mdi-calendar-month"
                  color="#60696c"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="clas.dateEnd"
                header-color="#60696c"
                color="#60696c"
                event-color="#60696c"
                @input="showEndDateMenu = false"
              />
            </v-menu>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Group Time related components together:
        - Length of the class
        - Select start times in the week
        - Date start and End date
     -->

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
            />
          </v-col>
        </v-row> -->

    <br />
    <v-row class="text-center">
      <v-col cols="6">
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

      <v-col cols="6">
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
  </v-main>
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
      // @todo Jess: what is this for?
      sanitized: false,
      showStartDateMenu: false,
      showEndDateMenu: false,

      // @todo Update this to be populated by an API instead
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
        allowWalkin: false,

        // @todo Perhaps allow the new external location to be stored directly in this object too
      },

      // @todo Better naming
      addLocationCheckbox: false,

      // @todo Jess: What is this used for?
      valid: null,

      nameRules: [
        (v) => !!v || "Name is required",
        (v) => (v && v.length <= 20) || "Please fill is the required space",
      ],
      classLengthRules: [
        // @todo Might allow for empty or 0 mins duration to signify undefined
        (length) => !!length || "Please enter a duration",
        (length) => length > 0 || "Cannot have a class of 0 mins or less",
      ],
      maxParticipantRules: [
        // @todo Might allow partner to skip this, and have "unlimited" participants? Perhaps add a default if none specified
        (length) => !!length || "Max participant is required",
        (length) => length > 0 || "Cannot have a class of 0 mins or less",
      ],
      rules: [
        // @todo To research what is the average size
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
    replaceMessage() {
      this.clas.description = this.$sanitize(this.clas.description);
      this.sanitized = true;
    },
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
  text-align: left;
}
</style>
