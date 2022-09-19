<template>
  <v-main id="signup">
    <v-row justify="center">
      <div class="signup">
        <img alt="Logo" src="../assets/logo.png" width="360" height="360" />

        <p>
          <span style="color: #2457ff">
            {{ parsed_admin ? "Admin" : "Employee" }}
          </span>
          account creation link
        </p>

        <v-text-field
          v-autofocus
          type="text"
          v-model="name"
          placeholder="Name"
          @keypress.enter="signUp"
          prepend-icon="mdi-account"
          required
        />

        <!-- @todo Make a info tooltip that shows this on hover, "Readonly, email used for account creation" -->
        <v-text-field
          type="text"
          readonly
          v-model="parsed_email"
          prepend-icon="mdi-email"
          required
        />

        <v-text-field
          type="password"
          v-model="password"
          placeholder="Password"
          @keypress.enter="signUp"
          prepend-icon="mdi-lock"
          required
        />

        <div id="termsAndCondition">
          *By creating an account, you agree to the
          <a href="https://terms.classexpress.com" target="_blank">
            terms and conditions
          </a>
        </div>

        <br />

        <v-btn
          width="30em"
          outlined
          @click="signUp"
          color="green darken-2"
          dark
        >
          sign up
        </v-btn>

        <br />
        <br />
        <br />
        <br />

        <div style="text-align: left; margin-left: 1em; opacity: 0.8">
          Already have an account?
        </div>
        <v-btn
          :to="{ name: 'login' }"
          width="30em"
          outlined
          color="blue darken-1"
          dark
        >
          login now!
        </v-btn>

        <br />
        <br />
        <br />
        <br />
      </div>
    </v-row>
  </v-main>
</template>

<script>
/**
 * @Todo - Add in browser's "required" attribute checker for input.
 */

import firebase from "firebase/app";
import "firebase/auth";
import api from "../store/utils/fetch";

// Function to map a given err.code and return a user friendly message
const getErrorMessage = (err) =>
  ({
    "auth/wrong-password": "Invalid password or email.",
    "auth/email-already-in-use":
      "Email is used, please log in instead. Reset password if forgotten.",
    "auth/network-request-failed": "Please check your internet connection!",
  }[err.code]);

export default {
  name: "SignUp",

  // Props only have basic type check, as link verification is in _verifyAccountCreationRequest() for more complex verification logic
  props: {
    accountCreationRequest: String,
  },

  // On created / basically when user first loads the page, check if link is valid
  created() {
    this._verifyAccountCreationRequest();
  },

  data() {
    return {
      // parsed_email and parsed_admin values are inserted by _verifyAccountCreationRequest() logic and should not be user modified
      parsed_email: "",
      parsed_admin: "",

      name: "",
      password: "",
      phoneNumber: "", // Make an optional input box for the user
    };
  },

  methods: {
    back() {
      this.$router.push({ name: "welcome" });
    },

    // Call API to verify the accountCreationRequest string, and inject the values into the component once they are verified
    // Only called by created Hook to verify before user creates account, preventing them if invalid with a non-dimissable ErrorDialog
    async _verifyAccountCreationRequest() {
      try {
        // This API must allow unauthenticated calls as the user is not logged in at this point, but should support rate limiting
        // Pass the encoded accountCreationRequest object received in the URL query directly back to the server for verification
        const response = await api.post("/employees/new/verify", {
          accountCreationRequest: this.accountCreationRequest,
        });

        // Let the catch block handle this
        if (!response.success)
          throw new Error(
            "Link failed API verification with: " + response.error
          );

        // Parse the encoded accountCreationRequest object from base64 ONLY AFTER validating with the API
        const { name, email, admin } = JSON.parse(
          atob(this.accountCreationRequest)
        );

        // Attached the values parsed out, onto the component to show on the UI
        this.name = name;
        this.parsed_email = email;
        this.parsed_admin = admin;
      } catch (error) {
        const verificationError = this.$error.createError(
          this.$error.ERROR.level.FATAL,
          this.$error.ERROR.custom(
            "Account creation link verification failed!",
            error.message
          )
        );
        // @todo Put dismissable on more info object, the check for dimissable should read from more details too?
        // http://localhost:8081/#/signup?token=1whsho21c3&email=test%40enkeldigital.com

        // Set dismissable to false as users should not continue with signup flow if the link is invalid in whatever way
        verificationError.dismissable = false;
        this.$error.new(verificationError);
      }
    },

    // Signups for both employee/admin
    // For creating firebase auth accounts and saving their names to the DB, as their CE account has already been created and stored in DB
    async signUp() {
      // Show loading screen before signUp logic executes
      const loaderRequestID = this.$loader.new();

      try {
        // Create new user and send them a email verification email
        await firebase
          .auth()
          .createUserWithEmailAndPassword(this.parsed_email, this.password);

        /*
          This needs to be done before signout as the API calls in these signup flows need the auth token
          await to prevent signout from executing before API completes which might delete JWT before the API call is made due to nature of async call
       
          The email will be retrieved from the firebase auth JWT to prove that the user really used that email for account creation
        */
        const res = await api.post("/employees/new/complete", {
          // Pass the encoded accountCreationRequest string right back to API for verification
          accountCreationRequest: this.accountCreationRequest,
          employee: {
            name: this.name,
          },
        });

        // Check for success with res and throw for signup logic to catch
        // @todo Test if this error throwing is successfully caught by errorDialog... yes i guess? since look at the catch block with the createError?
        // @todo Handle this failure case more specifically?
        if (!res.success) throw new Error(res.error);

        /* Dispatch signin action and redirect to homescreen after auth process completes */
        this.$store.dispatch("signin", this.parsed_email);
        this.$router.replace({ name: "home" });
      } catch (error) {
        // In case user is not signed out when an error is thrown, this makes sure we sign the user out with firebase auth
        if (firebase.auth().currentUser) firebase.auth().signOut();

        this.$error.new(
          this.$error.createError(
            this.$error.ERROR.level.RETRY,
            this.$error.ERROR.custom(
              "Signup failure",
              getErrorMessage(error) || error.message
            )
          )

          // @todo Need to delete firebase auth account anot?
        );
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
img {
  background-size: cover;
}

.signup {
  flex-direction: column;

  align-items: center;

  position: absolute;
  top: 8vh;
  left: 38%;
  right: 38%;
  bottom: 10vh;
}
</style>
