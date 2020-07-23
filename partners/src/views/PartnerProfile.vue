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
              <v-list-item-title>company name</v-list-item-title>
              <v-list-item-subtitle
                >Number of employees: 23</v-list-item-subtitle
              >
              <v-list-item-subtitle
                >Number of Acitve Classes: 23</v-list-item-subtitle
              >
              <v-list-item-subtitle>Available Points: 23</v-list-item-subtitle>
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
              :rules="nameRules"
              label="Company Name"
              placeholder="Basic Guitar"
              color="#60696c"
              required
            />

            <v-text-field
              :rules="nameRules"
              label="Email"
              placeholder="abc@enkel.com"
              color="#60696c"
              required
            />

            <v-text-field
              :rules="nameRules"
              label="Telephone No."
              placeholder="96475394"
              color="#60696c"
              required
            />

            <v-text-field
              :rules="nameRules"
              label="Website"
              placeholder="guitar.com"
              color="#60696c"
              required
            />

            <v-combobox
              :items="classCategoryList"
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
              v-autofocus
              type="text"
              rows="4"
              outlined
              label="Company Description"
              placeholder="Company Description"
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
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-content>
  <!-- <div>
    {{ partner }}
  </div> -->
</template>

<script>
import MapImage from "@/components/MapImage";
import api from "../store/utils/fetch";

export default {
  name: "PartnerProfile",
  components: {
    // MapImage,
  },
  props: ["partnerID"],
  data() {
    return {
      partner: undefined,
      classCategoryList: ["tech", "cooking", "lifestyle", "music", "art"],

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
  created() {
    this.getPartner();
  },
  methods: {
    async getPartner() {
      this.partner = (
        await api.get(`/partner/details/${this.partnerID}`)
      ).partner;
    },
    remove(item) {
      this.clas.classCategory.splice(this.clas.classCategory.indexOf(item), 1);
      this.clas.classCategory = [...this.clas.classCategory];
    },
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
