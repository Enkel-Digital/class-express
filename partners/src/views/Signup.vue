<template>
  <v-main id="signup">
    <v-row justify="center">
      <div class="signup">
        <img alt="Logo" src="../assets/logo.png" width="360" height="360" />

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
          v-model="email"
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

        <div style="text-align: left; margin-left: 1em; opacity: 0.8;">
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

  // Props only have basic type check, as link verification logic is in _validateLink() for more complex validation
  props: {
    token: String,
    email: String,
  },

  // On created / basically when user first loads the page, check if link is valid
  created() {
    console.log("calling validate link");
    this._validateLink();
  },

  data() {
    return {
      name: "",
      password: "",
      phoneNumber: "", // Make an optional input box for the user
    };
  },

  methods: {
    back() {
      this.$router.push({ name: "welcome" });
    },

    // Checks if expired and Validate email and token first before calling API to validate the combination
    // Manual validation is used instead of prop validation functions as this flow is more complexed and async
    // Only called by the created Hook, to validate first before user goes through signup flow, to prevent them from creating if invalid
    // Disables signup flow on failure using a non-dimissable ErrorDialog
    async _validateLink() {
      try {
        // Maybe this should be the code in the backend??
        const isEmailValid = this.email && /.+@.+\..+/.test(this.email);
        if (!isEmailValid)
          throw new Error("Invalid email in link, double check or contact us");

        if (!this.token) throw new Error("Missing token");

        const callValue = {
          email: this.email,
          token: this.token,
        };

        console.log("called again, valu of email is? ", callValue);

        debugger;
        // This API must allow unauthenticated calls as the user is not logged in at this point, but should support rate limiting
        // Pass the data received in the URL query to the server for validation
        const response = await api.post(
          "/employees/new/validate-link",
          callValue
        );
        console.log("completed validation check ", response, callValue);

        // Let the catch block handle this
        if (!response.success)
          throw new Error("Link failed API validation with: " + response.error);
      } catch (error) {
        const validationError = this.$error.createError(
          this.$error.ERROR.level.FATAL,
          this.$error.ERROR.custom(
            "Account creation link validation failed!",
            error.message
          )
        );
        // @todo Put dismissable on more info object, the check for dimissable should read from more details too?
        // http://localhost:8081/#/signup?token=1whsho21c3&email=test%40enkeldigital.com

        // Set dismissable to false as users should not continue with signup flow if the link is invalid in whatever way
        validationError.dismissable = false;
        this.$error.new(validationError);
      }
    },

    // Signups for both employee/admin
    // For creating firebase auth accounts and saving their names to the DB, as their CE account has already been created and stored in DB
    async signUp() {
      // Show loading screen before signUp logic executes
      const loaderRequestID = this.$loader.new();

      try {
        // Make lowercase, refer to notes & faq on why this is lowercase.
        // tl;dr Firebase auth like google ignores the email RFC and forces email case-insensitivity
        this.email = this.email.toLowerCase();

        console.log("here BEFORE fire auth acc created", this.email);

        // for wtv reason this triggers created hook?
        // Create new user and send them a email verification email
        await firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password);

        console.log("here BEFORE employee continue API is called", this.email);

        /*
          This needs to be done before signout as the API calls in these signup flows need the auth token
          await to prevent signout from executing before API completes which might delete JWT before the API call is made due to nature of async call
        */
        debugger;
        const res = await api.post("/employees/new/complete", {
          employee: {
            name: this.name, // The actual name of the user, and not the email + token temporarily stored in the DB
          },
          // Pass the token back to the API for verification
          // @note The email will be retrieved from the firebase auth JWT to prove that the user really used that email for account creation
          token: this.token,
        });

        // Check for success with res and throw for signup logic to catch
        // @todo Test if this error throwing is successfully caught by errorDialog... yes i guess? since look at the catch block with the createError?
        // @todo Handle this failure case more specifically?
        if (!res.success) throw new Error(res.error);

        console.log(
          "here after employee continue API is called",
          this.email,
          res
        );

        // redirect user to homescreen after auth process is all completed

        // Await for async dispatch to ensure app only starts after user info is available.
        await this.$store.dispatch("getUserDetails", this.email);
        this.$store.dispatch("init"); // Basically replace this with a signIn action

        // Route to the user's home page, after login
        this.$router.replace({ name: "home" });
      } catch (error) {
        // In case user is not signed out when an error is thrown, this makes sure we sign the user out with firebase auth
        if (firebase.auth().currentUser) firebase.auth().signOut();

        // @todo Technically I can leave this for global error handler to catch right? Only reason for this is better readability and since we also wanna sign user out and call the finally thing...
        // @todo throw api error instead and pass in retry?
        this.$error.new(
          this.$error.createError(
            this.$error.ERROR.level.RETRY,
            // @todo Change this to use the AUTH error type then
            // this.$error.ERROR.custom("Signup Failed", getErrorMessage(error))
            this.$error.ERROR.custom(
              "Signup failure",
              getErrorMessage(error) || error.message
            ),
            { actions: { retry: () => this.signUp() } }
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
