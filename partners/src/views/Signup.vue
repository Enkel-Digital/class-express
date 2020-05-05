<template>
  <div class="owner">
    <v-row>
      <v-col cols="15" sm="6" md="4">
        <img alt="Login image" src="../assets/logo.png" width="360" height="360" />
        <h1>Let's Get Started!</h1>
      </v-col>

      <v-col cols="15" sm="6" md="7">
        <v-stepper v-model="e6" vertical>
          <v-stepper-step :complete="e6 > 1" step="1">Personal Information</v-stepper-step>

          <v-stepper-content step="1">
            <v-form>
              <v-row>
                <v-col cols="15" sm="6" md="10">
                  <v-text-field
                    v-model="name"
                    label="Name"
                    :rules="nameRules"
                    prepend-icon="mdi-account"
                  ></v-text-field>
                </v-col>

                <v-col cols="15" sm="6" md="10">
                  <v-text-field
                    v-model="phone"
                    :rules="phoneRules"
                    label="Mobile Number"
                    hint="For emergency purposes"
                    prepend-icon="mdi-cellphone"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="15" sm="6" md="10">
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="Email"
                    prepend-icon="mdi-email"
                    :error-messages="emailErrors"
                    required
                    @input="$v.email.$touch()"
                    @blur="$v.email.$touch()"
                  ></v-text-field>
                </v-col>

                <v-col cols="15" sm="6" md="10">
                  <v-text-field
                    v-model="password"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, rules.min]"
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

            <v-btn color="primary" @click="e6 = 2">Continue</v-btn>
          </v-stepper-content>

          <v-stepper-step :complete="e6 > 2" step="2">Company Information</v-stepper-step>
          <v-stepper-content step="2">
            <v-form>
              <v-row>
                <v-col cols="15" sm="6" md="10">
                  <v-text-field
                    v-model="name"
                    :rules="nameRules"
                    label="Company Name"
                    required
                    prepend-icon="mdi-card-account-details"
                  ></v-text-field>
                </v-col>

                <v-col cols="15" sm="6" md="10">
                  <v-text-field
                    v-model="phone"
                    :rules="phoneRules"
                    label="Telephone Number"
                    prepend-icon="mdi-phone"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="15" sm="6" md="10">
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="Email"
                    prepend-icon="mdi-email"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="15" sm="6" md="5">
                  <v-text-field
                    v-model="Location"
                    label="Address Line 1"
                    prepend-icon="mdi-map-marker"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="15" sm="6" md="5">
                  <v-text-field v-model="Location" label="Address Line 2 (optional)" prepend-icon></v-text-field>
                </v-col>

                <v-col cols="15" sm="6" md="5">
                  <v-text-field
                    v-model="Location"
                    label="Blk/Unit No."
                    hint="e.g. 100/01-02"
                    prepend-icon="map-marker"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="15" sm="6" md="5">
                  <v-text-field
                    v-model="Location"
                    label="Postal Code"
                    :rules="postalRules"
                    prepend-icon
                    required
                  ></v-text-field>
                </v-col>

                <v-col class="d-flex" cols="15" sm="6" md="10">
                  <v-select
                    :items="businessTypes"
                    label="Type of Business"
                    prepend-icon="mdi-format-list-bulleted-type"
                    required
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>

            <v-btn color="primary" @click="validate">Continue</v-btn>
            <v-btn text @click="e6 -= 1">Back</v-btn>
          </v-stepper-content>

          <v-stepper-step :complete="e6 > 3" step="3">Finish</v-stepper-step>
          <v-stepper-content step="3">
            <h2>You're Set to Go!</h2>
            <p>Please check your inbox and verify your email</p>
            <v-btn color="primary" @click="e6 = 4">Finish</v-btn>
            <v-btn text @click="e6 -= 1">Back</v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-col>
    </v-row>
  </div>
</template>
<!-- <img alt="Login image" src="../assets/logo.png" width="360" height="360" />

    <input
      v-autofocus
      type="text"
      v-model="name"
      placeholder="Name"
      @keypress.enter="signUp"
      required
    />
    <br />
    <input type="text" v-model="email" placeholder="Email" @keypress.enter="signUp" required />

    <input
      type="password"
      v-model="password"
      placeholder="Password"
      @keypress.enter="signUp"
      required
    />

    <p class="error">{{ error_msg }}</p>
    <button @click="signUp">Sign Up</button>
    <br />
    <button id="back-btn" @click="back">Back</button>-->

<script>
/**
 * @Todo - Add in browser's "required" attribute checker for input.
 */

import { auth } from "firebase";

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
      name: "",
      email: "Email",
      error_msg: "",
      e6: 1,

      show1: false,
      password: "Password",
      rules: {
        required: value => !!value || "Required.",
        min: v => v.length >= 8 || "Min 8 characters"
      },
      nameRules: [v => !!v || "Name is required"],
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ],
      phoneRules: [
        v => !!v || "Number is required",
        v => (v && v.length <= 8) || "Number is invalid"
      ],
      postalRules: [v => (v && v.length <= 6) || "Postal code is invalid"],

      businessTypes: [
        "Sports",
        "Tuition",
        "Music",
        "IT",
        "Lifestyle",
        "Fitness",
        "Dance",
        "Cooking"
      ]
    };
  },
  methods: {
    back() {
      this.$router.push({ name: "welcome" });
    },
    validate() {
      this.$refs.form.validate();
    },
    signUp: async function() {
      try {
        // After signup, user will be automatically signed in, redirect to home
        // eslint-disable-next-line no-unused-vars
        const usr = await auth().createUserWithEmailAndPassword(
          this.email,
          this.password
        );

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
    }
  }
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
