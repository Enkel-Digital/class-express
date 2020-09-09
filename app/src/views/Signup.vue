<template>
  <v-main id="signup">
    <!-- Dialog to inform user to verify email before redirecting them to the signup page -->
    <v-dialog v-model="verifyEmailDialog" max-width="calc(100% - 2em)">
      <v-card>
        <v-card-title class="headline">
          Please verify your email before logging in!
        </v-card-title>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="green darken-1"
            text
            @click="$router.replace({ name: 'login' })"
          >
            login now!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-img
      alt="ClassExpress logo"
      src="../assets/logo.png"
      max-height="calc(100% - 1em)"
      max-width="calc(100% - 1em)"
    />

    <input
      v-autofocus
      type="text"
      v-model="firstName"
      placeholder="First Name"
      @keypress.enter="signUp"
      required
    />
    <br />
    <input
      type="text"
      v-model="lastName"
      placeholder="Last Name"
      @keypress.enter="signUp"
      required
    />
    <br />
    <input
      type="text"
      v-model="email"
      placeholder="Email"
      @keypress.enter="signUp"
      required
    />

    <input
      type="password"
      v-model="password"
      placeholder="Password"
      @keypress.enter="signUp"
      required
    />

    <div id="termsAndCondition">
      *By creating an account, you agree to the
      <a href="https://terms.classexpress.com" target="_blank">
        terms and conditions
      </a>
    </div>

    <v-btn @click="signUp" width="calc(100% - 6em)" color="green darken-1" dark>
      Sign Up
    </v-btn>

    <br />
    <br />

    <v-btn @click="back" width="calc(100% - 6em)" color="grey" dark>
      back
    </v-btn>

    <br />
    <br />

    <div style="text-align: left; margin-left: 3em; opacity: 0.8">
      Already have an account?
    </div>
    <v-btn
      :to="{ name: 'login' }"
      width="calc(100% - 6em)"
      color="blue darken-1"
      dark
    >
      login now!
    </v-btn>

    <br />
    <br />
    <br />
    <br />
  </v-main>
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
      return "Email already in use, please log in instead.<br />Reset password if you have forgotten it.";
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
      verifyEmailDialog: false,

      email: "",
      firstName: "",
      lastName: "",
      password: "",
      error_msg: "",
    };
  },
  methods: {
    back() {
      this.$router.push({ name: "welcome" });
    },
    async signUp() {
      // Show loading screen before signUp logic executes
      const loaderRequestID = this.$loader.new();

      try {
        // Make lowercase, refer to notes & faq on why this is lowercase.
        // tl;dr Firebase auth like google ignores the email RFC and forces email case-insensitivity
        this.email = this.email.toLowerCase();

        // Create new user and send them a email verification email
        await firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password);
        // Send user email verification email right await after account creation
        firebase.auth().currentUser.sendEmailVerification();

        const newUser = {
          user: {
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,

            // @todo Hardcoded values, to be removed
            countryCode: "SG",
            cityCode: "SG",
            timezone: "SGT",
            currency: "SGD",
          },
        };

        // This needs to be before signout, as we need the token to create a new user.
        // await to prevent signout from executing before post which will delete the JWT and make this call rejected with a 401
        const res = await api.post("/user/new", newUser);
        // @todo add api Error here?

        // Sign user out
        firebase.auth().signOut();

        // Show dialog to inform user to verify email and allow them to redirect to login view
        this.verifyEmailDialog = true;
      } catch (error) {
        /**
         * If there is an error before user is signed out, sign user out to try again
         * @notice This is not ideal as if the store dispatch / API failed then user needs to login directly instead of retry.
         * @todo To optimize this.
         */
        if (firebase.auth().currentUser) firebase.auth().signOut();

        // @todo Remove before production
        console.error(error);

        // Create new user error and show with ErrorDialog
        const userError = this.$error.createError(
          this.$error.ERROR.level.RETRY,
          this.$error.ERROR.custom("Signup Failed", error_msg(error))
        );
        this.$error.new(userError);
      } finally {
        // Remove loader after login logic completes regardless of whether signup failed or succeeded
        // Inside finally to ensure execution even if catch block was ran
        this.$loader.clear(loaderRequestID);
      }
    },
  },
};
</script>

<style scoped>
input {
  margin: 0.4em 0;
  padding: 1em;

  width: calc(100% - 6em);

  border: 1px solid turquoise;
  border-radius: 0.4em;
}

#termsAndCondition {
  font-size: 0.7em;
}

.error {
  margin-top: 1em;
  margin-bottom: 1em;
}
</style>
