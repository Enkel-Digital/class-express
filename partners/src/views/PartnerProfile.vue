<template>
  <v-main id="PartnerProfile">
    <v-row>
      <!-- @todo make the outline resizable -->
      <v-card
        outlined
        class="mx-auto bottom-margin"
        max-width="20em"
        max-height="26em"
      >
        <!-- @todo Load the partner pic instead -->
        <!-- @todo Allow partner admin to modify the partner images -->
        <v-img :src="partner.pictureSources" alt="Partner Main Image" />

        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>{{ partner.name }}</v-list-item-title>
            <v-list-item-subtitle>
              Number of employees:
              {{ numberOfEmployees }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              Number of Classes:
              {{ numberOfClass.length }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>

      <v-card outlined class="mx-auto bottom-margin" width="40em">
        <v-card-text>
          <h2 style="color: #455a64" class="text-left font-weight-light">
            DETAILS
          </h2>
          <br />

          <v-text-field
            v-model="partner.name"
            :rules="nameRules"
            label="Company Name"
            color="#60696c"
            required
          />

          <v-text-field
            v-model="partner.email"
            :rules="nameRules"
            label="Email"
            placeholder="admin@example.com"
            color="#60696c"
            required
          />

          <v-text-field
            v-model="partner.phoneNumber"
            :rules="nameRules"
            label="Telephone No."
            placeholder="+65 91234567"
            color="#60696c"
            required
          />

          <v-text-field
            v-model="partner.website"
            label="Website"
            placeholder="MUST BE HTTPS LIKE -->  https://example.com/"
            color="#60696c"
            required
          />

          <!-- @todo Integrate with API to show suggestions -->
          <v-combobox
            v-model="partner.tags"
            :items="partnerTagsListAutocompleteItems"
            chips
            color="#60696c"
            clearable
            label="Company Categories"
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

          <!-- @todo Add a tooltip to show the hints -->
          <v-textarea
            v-model="partner.description"
            v-autofocus
            type="text"
            rows="5"
            outlined
            label="Company Description"
            hint="You can use HTML for text formatting!"
            no-resize
            color="#60696c"
            required
          />
        </v-card-text>
      </v-card>

      <br />

      <v-card outlined ref="form" class="mx-auto bottom-margin" width="30em">
        <v-card-text>
          <h2 style="color: #455a64" class="text-left font-weight-light">
            ADDRESS
          </h2>
          <br />

          <v-text-field
            v-model="partner.location_address"
            :rules="addressRules"
            label="Address Line 1"
            placeholder="123 Peach St"
            color="#60696c"
            required
          />

          <v-text-field label="Address Line 2" color="#60696c" />

          <v-text-field
            label="Unit No."
            color="#60696c"
            placeholder="12-02"
            required
          />

          <v-text-field
            :rules="nameRules"
            label="Postal Code"
            required
            placeholder="111222"
            color="#60696c"
          />

          <v-text-field
            :rules="nameRules"
            label="Country"
            required
            color="#60696c"
            placeholder="Singapore"
          />
        </v-card-text>
      </v-card>
    </v-row>

    <br />
    <!-- @todo Update this to support color change depending on whether there is data changed or not -->
    <v-btn color="#60696c" rounded width="15em" outlined depressed large>
      Save Changes
    </v-btn>

    <!-- @todo Add a reset button to clear unsaved changes -->
  </v-main>
</template>

<script>
// @todo Add icons to show verification status and buttons for partners to request for verification

// import MapImage from "@/components/MapImage";
import { mapState } from "vuex";

export default {
  name: "PartnerProfile",
  components: {
    // MapImage,
  },

  created() {
    // @todo All these actions should be cacheable as they should not be re-called over and over again which will overload the API
    // Either remove get partner detial here or implement a cache in the API plus action.
    this.$store.dispatch("partner/getPartnerDetails");
    this.$store.dispatch("partner/getPartnerTags");
    this.$store.dispatch("employees/getEmployees");
  },

  data() {
    return {
      // @todo Integrate this with API for a list of popular/recommended tags
      partnerTagsListAutocompleteItems: [
        "tech",
        "cooking",
        "lifestyle",
        "music",
        "art",
      ],

      nameRules: [
        (v) => !!v || "Name is required",
        (v) => (v && v.length <= 20) || "Please fill is the required space",
      ],
      addressRules: [(v) => !!v || "Please fill is the required space"],
    };
  },

  computed: {
    ...mapState("partner", ["partner"]),
    numberOfEmployees() {
      return Object.keys(this.$store.state.employees.employees).length;
    },
    numberOfClass() {
      return Object.keys(this.$store.state.classes.classes).length;
    },
  },

  // @todo Implement the sync changes method, similiar to settings view of App.
  methods: {
    // @todo Fix this method.
    remove(item) {
      this.partnerTags.splice(this.partnerTags.indexOf(item), 1);
      this.partnerTags = [...this.partnerTags];
    },
  },
};
</script>

<style scoped>
#PartnerProfile {
  margin: 1em;
  margin-top: 1em;
}

.bottom-margin {
  margin-bottom: 2em;
}
</style>
