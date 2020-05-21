<template>
  <div class="owner">
    <v-row>
      <v-col cols="15" sm="6" md="4">
        <img
          alt="Login image"
          src="../assets/logo.png"
          width="360"
          height="360"
        />
        <h1>Let's Get Started!</h1>
        <v-btn :disabled="employee || owner" @click="owner = true"
          >I am an Owner</v-btn
        >
        <v-btn :disabled="true" @click="employee = true"
          >I am an Employee</v-btn
        >
        <!-- <v-btn :disabled="employee || owner" @click="employee = true"
          >I am an Employee</v-btn
        > -->
      </v-col>

      <!-- stepper for owner -->
      <v-col cols="15" sm="6" md="7">
        <v-stepper v-if="owner" v-model="step" vertical>
          <v-stepper-step :complete="step > 1" step="1">
            Login Details
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-form ref="ownerLoginDetails">
              <v-row>
                <v-col cols="15" sm="6" md="10">
                  <v-text-field
                    label="Name"
                    :rules="nameRules"
                    prepend-icon="mdi-account"
                  ></v-text-field>
                </v-col>

                <v-col cols="15" sm="6" md="10">
                  <v-text-field
                    :rules="phoneRules"
                    label="Mobile Number"
                    hint="For emergency purposes"
                    prepend-icon="mdi-cellphone"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="15" sm="6" md="10">
                  <v-text-field
                    :rules="emailRules"
                    label="Email"
                    prepend-icon="mdi-email"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="15" sm="6" md="10">
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
                </v-col>
              </v-row>
            </v-form>

            <v-btn color="primary" @click="validateOwnerLoginDetails"
              >Continue</v-btn
            >
          </v-stepper-content>

          <v-stepper-step :complete="step > 2" step="2"
            >Company Information</v-stepper-step
          >
          <v-stepper-content step="2">
            <v-form ref="ownerCompanyDetails">
              <v-row>
                <v-col cols="15" sm="6" md="10">
                  <v-text-field
                    :rules="nameRules"
                    label="Company Name"
                    required
                    prepend-icon="mdi-card-account-details"
                  ></v-text-field>
                </v-col>

                <v-col cols="15" sm="6" md="10">
                  <v-text-field
                    :rules="phoneRules"
                    label="Telephone Number"
                    prepend-icon="mdi-phone"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="15" sm="6" md="10">
                  <v-text-field
                    :rules="emailRules"
                    label="Email"
                    prepend-icon="mdi-email"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="15" sm="6" md="5">
                  <v-text-field
                    label="Address Line 1"
                    :rules="nameRules"
                    prepend-icon="mdi-map-marker"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="15" sm="6" md="5">
                  <v-text-field
                    label="Address Line 2 (optional)"
                    prepend-icon
                  ></v-text-field>
                </v-col>

                <v-col cols="15" sm="6" md="5">
                  <v-text-field
                    :rules="nameRules"
                    label="Blk/Unit No."
                    hint="e.g. 100/01-02"
                    prepend-icon="map-marker"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="15" sm="6" md="5">
                  <v-text-field
                    label="Postal Code"
                    :rules="postalRules"
                    prepend-icon
                    required
                  ></v-text-field>
                </v-col>

                <v-col class="d-flex" cols="15" sm="6" md="10">
                  <v-autocomplete
                    :items="businessTypes"
                    :filter="customFilter"
                    :rules="[(v) => !!v || 'Selection is required']"
                    color="white"
                    item-text="name"
                    prepend-icon="mdi-format-list-bulleted-type"
                    label="Type of Business"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-form>

            <v-btn color="primary" @click="validateOwnerCompanyDetails"
              >Continue</v-btn
            >
            <v-btn text @click="step -= 1">Back</v-btn>
          </v-stepper-content>

          <v-stepper-step :complete="step > 3" step="3">Finish</v-stepper-step>
          <v-stepper-content step="3">
            <h2>You're Set to Go!</h2>
            <p>Please check your inbox and verify your email</p>
            <v-btn color="primary" @click="$router.push({ name: 'home' })"
              >Finish</v-btn
            >
          </v-stepper-content>
        </v-stepper>
        <!-- end of stepper for owner -->

        <!-- stepper for employee -->
        <v-col cols="15" sm="6" md="7">
          <v-stepper v-if="employee" v-model="step" vertical>
            <v-stepper-step :complete="step > 1" step="1"
              >Login Details
            </v-stepper-step>
            <v-stepper-content step="1">
              <v-form ref="employeeLoginDetails">
                <v-row>
                  <v-col cols="15" sm="6" md="10">
                    <v-text-field
                      label="Name"
                      :rules="nameRules"
                      prepend-icon="mdi-account"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="15" sm="6" md="10">
                    <v-text-field
                      :rules="emailRules"
                      label="Email"
                      prepend-icon="mdi-email"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="15" sm="6" md="10">
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
                  </v-col>
                </v-row>
              </v-form>

              <v-btn color="primary" @click="validateEmployeeLoginDetails"
                >Continue
              </v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="step > 2" step="2"
              >Your Company</v-stepper-step
            >
            <v-stepper-content step="2">
              <v-form ref="employeeCompanyDetails">
                <v-row>
                  <v-col cols="15" sm="6" md="10">
                    <v-autocomplete
                      :items="company"
                      :filter="customFilter"
                      :rules="[(v) => !!v || 'Selection is required']"
                      color="white"
                      item-text="name"
                      prepend-icon="mdi-card-account-details"
                      label="Select your company"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-form>

              <v-btn color="primary" @click="validateEmployeeCompanyDetails"
                >Continue
              </v-btn>
              <v-btn text @click="step -= 1">Back</v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="step > 3" step="3"
              >Finish</v-stepper-step
            >
            <v-stepper-content step="3">
              <h2>You're Set to Go!</h2>
              <p>Please check your inbox and verify your email</p>
              <v-btn color="primary" @click="$router.push({ name: 'home' })"
                >Finish</v-btn
              >
            </v-stepper-content>
          </v-stepper>
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
      owner: false,
      employee: false,
      name: "",
      email: "Email",
      error_msg: "",
      step: 1,

      show1: false,
      password: "Password",
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
    signUp: async function () {
      try {
        // After signup, user will be automatically signed in, redirect to home
        // eslint-disable-next-line no-unused-vars
        const usr = await firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password);

        const storeUser = this.$store.state.user;
        storeUser.email = this.email;
        storeUser.name = this.name;
        this.$store.commit("setter", ["user", storeUser]);

        // @todo push data to the server and push the new data into vuex
        // @todo perhaps can route them to a signup page, where instead of use 1 screen like now, we can do the UI below
        // https://vuetifyjs.com/en/components/windows/#account-creation
        // https://vuetifyjs.com/en/components/steppers/#usage

        this.$router.replace({ name: "home" });
      } catch (error) {
        // Set the message into the error box to show user the error
        this.error_msg = error_msg(error);
      }
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

button {
  margin: 1em 0 0 0;

  width: 70%;
  height: 3em;
  max-width: 20em;

  border-style: solid;
  border-width: thin;
  border-radius: 4em;
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
