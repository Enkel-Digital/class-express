<template>
  <v-content id="PartnerProfile">
    <v-row>
      <v-col cols="12" sm="3">
        <v-card outlined ref="form">
          <br />
          <br />

          <v-avatar size="140">
            <img
              src="http://mimgnews1.naver.net/image/433/2018/06/21/0000046075_001_20180621082632801.jpg"
              alt="John"
            />
          </v-avatar>

          <br />
          <br />

          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>{{ partner.name }}</v-list-item-title>
              <v-list-item-subtitle
                >Number of employees:
                {{ numberOfEmployees }}</v-list-item-subtitle
              >
              <v-list-item-subtitle
                >Number of Classes:
                {{ numberOfClass.length }}</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>

      <v-col cols="12" sm="5">
        <v-card outlined ref="form">
          <v-card-text>
            <h2 style="color: #455a64;" class="text-left font-weight-light">
              COMPANY DETAILS
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
              placeholder="abc@enkel.com"
              color="#60696c"
              required
            />

            <v-text-field
              v-model="partner.phoneNumber"
              :rules="nameRules"
              label="Telephone No."
              placeholder="96475394"
              color="#60696c"
              required
            />

            <v-text-field
              v-model="partner.website"
              label="Website"
              placeholder="guitar.com"
              color="#60696c"
              required
            />

            <v-combobox
              v-model="partnerTags"
              :items="partnerTagsList"
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

            <v-textarea
              v-model="partner.description"
              v-autofocus
              type="text"
              rows="5"
              outlined
              label="Company Description"
              hint="use HTML text formatting"
              no-resize
              color="#60696c"
              required
            />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card outlined ref="form">
          <v-card-text>
            <h2 style="color: #455a64;" class="text-left font-weight-light">
              COMPANY ADDRESS
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

            <v-text-field
              label="Address Line 2"
              placeholder=""
              color="#60696c"
            ></v-text-field>

            <v-text-field
              label="Unit No."
              color="#60696c"
              placeholder="12-02"
              required
            ></v-text-field>

            <v-text-field
              :rules="nameRules"
              label="Postal Code"
              required
              placeholder="111222"
              color="#60696c"
            ></v-text-field>

            <v-text-field
              :rules="nameRules"
              label="Country"
              required
              color="#60696c"
              placeholder="Singapore"
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <br />
    <v-row class="text-center">
      <v-col cols="12" sm="12">
        <v-btn color="#60696c" rounded width="15em" outlined depressed large>
          Save Changes
        </v-btn>
      </v-col>
    </v-row>
  </v-content>
</template>

<script>
import MapImage from "@/components/MapImage";
import api from "../store/utils/fetch";
import { mapState } from "vuex";

export default {
  name: "PartnerProfile",
  components: {
    // MapImage,
  },
  props: {
    partnerID: {
      default: 1,
      type: Number,
    },
  },
  data() {
    return {
      numberOfEmployees: {},
      numberOfClass: {},
      partnerTagsList: ["tech", "cooking", "lifestyle", "music", "art"],

      nameRules: [
        (v) => !!v || "Name is required",
        (v) => (v && v.length <= 20) || "Please fill is the required space",
      ],
      addressRules: [(v) => !!v || "Please fill is the required space"],
    };
  },
  created() {
    this.$store.dispatch("partner/getPartnerDetails", this.partnerID);
    this.$store.dispatch("partner/getPartnerTags", this.partnerID);
  },
  methods: {
    remove(item) {
      this.partnerTags.splice(this.partnerTags.indexOf(item), 1);
      this.partnerTags = [...this.partnerTags];
    },
  },
  computed: {
    ...mapState("partner", ["partner", "partnerTags"]),
  },
};
</script>

<style scoped>
#PartnerProfile {
  margin: 1em;
  margin-top: 1em;
  /* margin-left: 2em; */
  /* text-align: left; */
}
.v-text-field input {
  font-size: 1.5em;
}
.v-label input {
  font-size: 1.5em;
}
.text {
  font-size: 1.5em;
}
</style>
