<template>
  <div class="owner">
    <v-row>
      <v-col cols="10" sm="5">
        <img
          alt="Login image"
          src="../assets/logo.png"
          width="360"
          height="360"
        />
        <h2 class="font-weight-light">Let's Get Started!</h2>

        <br />

        <v-btn
          color="#60696c"
          outlined
          width="20em"
          rounded
          :disabled="employee || owner"
          @click="owner = true"
          >I am an Owner</v-btn
        >

        <br />
        <br />

        <v-btn
          color="#60696c"
          outlined
          rounded
          width="20em"
          :disabled="owner || employee"
          @click="employee = true"
          >I am an Employee</v-btn
        >
        <br />
        <br />

        <h4 class="font-weight-light">
          Already have an account?
          <router-link :to="{ name: 'login' }">
            Login here!
          </router-link>
        </h4>
      </v-col>

      <!-- stepper for owner -->
      <v-col cols="10" sm="5">
        <v-stepper v-if="owner" v-model="step" vertical>
          <v-stepper-step color="#60696c" :complete="step > 1" step="1">
            Login Details
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-form ref="ownerLoginDetails">
              <v-text-field
                v-model="firstName"
                label="First Name"
                :rules="nameRules"
                prepend-icon="mdi-account"
              ></v-text-field>

              <v-text-field
                v-model="lastName"
                label="Last Name"
                :rules="nameRules"
                prepend-icon=" "
              ></v-text-field>

              <v-text-field
                v-model="phoneNumber"
                :rules="phoneRules"
                label="Mobile Number"
                hint="For emergency purposes"
                prepend-icon="mdi-cellphone"
                required
              ></v-text-field>

              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Email"
                prepend-icon="mdi-email"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required]"
                :type="show1 ? 'text' : 'password'"
                name="input-10-1"
                label="Password"
                prepend-icon="mdi-lock"
                hint="At least 8 characters"
                counter
                @click:append="show1 = !show1"
              ></v-text-field>
            </v-form>

            <v-btn
              width="20em"
              color="#60696c"
              outlined
              @click="validateOwnerLoginDetails"
              >Continue</v-btn
            >
          </v-stepper-content>

          <v-stepper-step color="#60696c" :complete="step > 2" step="2"
            >Company Information</v-stepper-step
          >
          <v-stepper-content step="2">
            <v-form ref="ownerCompanyDetails">
              <v-text-field
                v-model="companyName"
                :rules="nameRules"
                label="Company Name"
                required
                prepend-icon="mdi-card-account-details"
              ></v-text-field>

              <v-text-field
                v-model="companyPhoneNumber"
                :rules="phoneRules"
                label="Telephone Number"
                prepend-icon="mdi-phone"
                required
              ></v-text-field>

              <v-text-field
                v-model="companyEmail"
                :rules="emailRules"
                label="Email"
                prepend-icon="mdi-email"
                required
              ></v-text-field>

              <v-text-field
                v-model="companyWebsite"
                label="Website"
                prepend-icon="mdi-web"
              ></v-text-field>

              <v-text-field
                v-model="addressLine1"
                label="Address Line 1"
                :rules="nameRules"
                prepend-icon="mdi-map-marker"
                required
              ></v-text-field>

              <v-text-field
                v-model="addressLine2"
                label="Address Line 2 (optional)"
                prepend-icon=" "
              ></v-text-field>

              <v-text-field
                v-model="unitNumber"
                :rules="nameRules"
                label="Unit No."
                hint="e.g. 01-02"
                prepend-icon=" "
                required
              ></v-text-field>

              <v-text-field
                v-model="postalCode"
                label="Postal Code"
                :rules="postalRules"
                prepend-icon=" "
                required
              ></v-text-field>

              <v-combobox
                v-model="partnerTags"
                :items="partnerTagsList"
                :rules="[(v) => !!v || 'Selection is required']"
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

              <v-textarea
                v-autofocus
                type="text"
                v-model="companyDescription"
                rows="4"
                :rules="nameRules"
                outlined
                placeholder="Enter Your Class Description"
                no-resize
                color="#60696c"
                required
              />
            </v-form>

            <v-btn
              outlined
              color="#60696c"
              width="20em"
              @click="validateOwnerCompanyDetails"
              >Continue</v-btn
            >
            <v-btn color="#60696c" outlined width="20em" text @click="step -= 1"
              >Back</v-btn
            >
          </v-stepper-content>

          <v-stepper-step :complete="step > 3" step="3">Finish</v-stepper-step>
          <v-stepper-content step="3">
            <h2>You're Set to Go!</h2>
            <p>Please check your inbox and verify your email</p>
            <v-btn width="20em" color="#60696c" outlined @click="partnerSignUp"
              >Finish</v-btn
            >
          </v-stepper-content>
        </v-stepper>

        <br />

        <v-btn
          color="#60696c"
          outlined
          v-if="owner"
          width="20em"
          @click="(owner = false), (employee = false)"
          >Back</v-btn
        >
        <!-- end of stepper for owner -->

        <!-- stepper for employee -->
        <v-col cols="15" sm="5">
          <v-stepper v-if="employee" v-model="step" vertical>
            <v-overlay v-if="employee" :opacity="opacity" :absolute="absolute">
              <p>This feature is coming soon!</p>
            </v-overlay>

            <v-stepper-step :complete="step > 1" step="1"
              >Login Details
            </v-stepper-step>
            <v-stepper-content step="1">
              <v-form ref="employeeLoginDetails">
                <v-text-field
                  label="First Name"
                  :rules="nameRules"
                  prepend-icon="mdi-account"
                ></v-text-field>

                <v-text-field
                  label="Last Name"
                  :rules="nameRules"
                  prepend-icon=" "
                ></v-text-field>

                <v-text-field
                  :rules="emailRules"
                  label="Email"
                  prepend-icon="mdi-email"
                  required
                ></v-text-field>

                <v-text-field
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required]"
                  :type="show1 ? 'text' : 'password'"
                  name="input-10-1"
                  label="Password"
                  prepend-icon="mdi-lock"
                  hint="At least 8 characters"
                  counter
                  @click:append="show1 = !show1"
                ></v-text-field>
              </v-form>

              <v-btn
                width="20em"
                color="#60696c"
                outlined
                @click="validateEmployeeLoginDetails"
                >Continue
              </v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="step > 2" step="2"
              >Your Company</v-stepper-step
            >
            <v-stepper-content step="2">
              <v-form ref="employeeCompanyDetails">
                <v-autocomplete
                  :items="company"
                  :filter="customFilter"
                  :rules="[(v) => !!v || 'Selection is required']"
                  color="white"
                  item-text="name"
                  prepend-icon="mdi-card-account-details"
                  label="Select your company"
                ></v-autocomplete>
              </v-form>

              <v-btn
                width="20em"
                color="#60696c"
                outlined
                @click="validateEmployeeCompanyDetails"
                >Continue
              </v-btn>
              <v-btn
                width="20em"
                color="#60696c"
                outlined
                text
                @click="step -= 1"
                >Back</v-btn
              >
            </v-stepper-content>

            <v-stepper-step :complete="step > 3" step="3"
              >Finish</v-stepper-step
            >
            <v-stepper-content step="3">
              <h2>You're Set to Go!</h2>
              <p>Please check your inbox and verify your email</p>
              <v-btn
                width="20em"
                color="#60696c"
                outlined
                @click="$router.push({ name: 'login' })"
                >Finish</v-btn
              >
            </v-stepper-content>
          </v-stepper>

          <br />

          <v-btn
            width="20em"
            color="#60696c"
            outlined
            v-if="employee"
            @click="(owner = false), (employee = false)"
            >Back</v-btn
          >
        </v-col>
        <!-- end of stepper fot employee -->
      </v-col>
    </v-row>
  </div>
</template>

<script>
/**
 * @Todo - Add in browser's "required" attribute checker for input.
 */

import firebase from "firebase/app";
import "firebase/auth";
import api from "../store/utils/fetch";

// Function to map and return a given err.code to a user friendly message
function error_msg(err) {
  switch (err.code) {
    case "auth/wrong-password":
      return "Invalid password or email.";
    case "auth/email-already-in-use":
      return "Email already in use, please log in instead. Reset password if you have forgotten it.";
    case "auth/network-request-failed":
      return "Oops, please check your internet connection!";
    default:
      return "Ugh, something went wrong! Try again please?";
  }
}

export default {
  name: "signUp",
  data() {
    return {
      partnerTagsList: ["tech", "cooking", "lifestyle", "music", "art"],

      owner: false,
      employee: false,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      companyName: "",
      companyEmail: "",
      companyWebsite: "",
      companyPhoneNumber: "",
      addressLine1: "",
      addressLine2: "",
      unitNumber: "",
      postalCode: "",
      companyDescription: "",
      partnerTags: "",
      error_msg: "",
      step: 1,
      absolute: true,
      opacity: 0.8,

      show1: false,
      rules: {
        required: (value) => !!value || "Required.",
        // min: (v) => v.length >= 8 || "Min 8 characters",
      },
      nameRules: [(v) => !!v || "Required"],
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      phoneRules: [
        (v) => !!v || "Number is required",
        (v) => (v && v.length <= 8) || "Number is invalid",
      ],
      postalRules: [(v) => (v && v.length <= 6) || "Postal code is invalid"],
      businessTypes: [
        { name: "Sports", abbr: "", id: 1 },
        { name: "Tuition", abbr: "", id: 2 },
        { name: "IT", abbr: "", id: 3 },
        { name: "Music", abbr: "", id: 4 },
        { name: "Lifestyle", abbr: "", id: 5 },
      ],
      hasSaved: false,
      isEditing: null,
      model: null,
      company: [
        { name: "Florida", abbr: "FL", id: 1 },
        { name: "Georgia", abbr: "GA", id: 2 },
        { name: "Nebraska", abbr: "NE", id: 3 },
        { name: "California", abbr: "CA", id: 4 },
        { name: "New York", abbr: "NY", id: 5 },
      ],
    };
  },
  methods: {
    back() {
      this.$router.push({ name: "welcome" });
    },
    validateOwnerLoginDetails() {
      this.$refs.ownerLoginDetails.validate();
      if (this.$refs.ownerLoginDetails.validate()) {
        this.step++;
      }
    },
    validateOwnerCompanyDetails() {
      this.$refs.ownerCompanyDetails.validate();
      if (this.$refs.ownerCompanyDetails.validate()) {
        this.step++;
      }
    },
    validateEmployeeLoginDetails() {
      this.$refs.employeeLoginDetails.validate();
      if (this.$refs.employeeLoginDetails.validate()) {
        this.step++;
      }
    },
    validateEmployeeCompanyDetails() {
      this.$refs.employeeCompanyDetails.validate();
      if (this.$refs.employeeCompanyDetails.validate()) {
        this.step++;
      }
    },
    customFilter(item, queryText, itemText) {
      const textOne = item.name.toLowerCase();
      const textTwo = item.abbr.toLowerCase();
      const searchText = queryText.toLowerCase();

      return (
        textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
      );
    },

    // when an admin register his/her account along with the business profile
    async partnerSignUp() {
      try {
        // Make lowercase, refer to notes & faq on why this is lowercase.
        // tl;dr Firebase auth like google ignores the email RFC and forces email case-insensitivity
        // this.email = this.email.toLowerCase();

        // After signup, user will be automatically signed in, redirect to home
        // eslint-disable-next-line no-unused-vars
        const usr = await firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password);

        const newEmployee = {
          employee: {
            partnerID: 2,
            name: this.firstName + " " + this.lastName,
            phoneNumber: this.phoneNumber,
            email: this.email,
            admin: true,
          },
        };

        const newPartner = {
          partner: {
            name: this.companyName,
            phoneNumber: this.companyPhoneNumber,
            email: this.companyEmail,
            location_address:
              this.addressLine1 +
              " " +
              this.addressLine2 +
              " " +
              this.unitNumber,
            location_postalCode: this.postalCode,
            location_coordinates: "123.1234454, 23.234512",
            description: this.companyDescription,
            website: this.companyWebsite,
          },
        };

        const res_Employee = await api.post("/employees/new", newEmployee);
        const res_Partner = await api.post("/partner/new", newPartner);

        await firebase.auth().signOut();

        // @todo push data to the server and push the new data into vuex
        // @todo perhaps can route them to a signup page, where instead of use 1 screen like now, we can do the UI below
        // https://vuetifyjs.com/en/components/windows/#account-creation
        // https://vuetifyjs.com/en/components/steppers/#usage

        this.$router.replace({ name: "login" });
      } catch (error) {
        const userError = this.$error.createError(
          this.$error.ERROR.level.RETRY,
          this.$error.ERROR.custom("Signup Failed", error_msg(error))
        );
        this.$error.new(userError);

        // Set the message into the error box to show user the error
        this.error_msg = error_msg(error);
      }
    },
    remove(item) {
      this.partnerTags.splice(this.partnerTags.indexOf(item), 1);
      this.partnerTags = [...this.partnerTags];
    },
  },
};
</script>

<style scoped>
img {
  background-size: cover;
}

input {
  margin: 1em 0;
  padding: 1em;

  width: 70%;
  max-width: 20em;

  border-radius: 1em;
}

.error {
  margin-top: 1em;
}

#back-btn {
  border-style: solid;
  border-width: thin;
  border-radius: 4em;
}
</style>
