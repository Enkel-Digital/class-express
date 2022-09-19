<template>
  <v-row justify="center">
    <div class="login">
      <img alt="Logo" src="../assets/logo.png" width="360" height="360" />

      <v-text-field
        v-autofocus
        type="text"
        v-model="email"
        placeholder="Email Address"
        @keypress.enter="login"
        prepend-icon="mdi-email"
        required
      />

      <v-text-field
        type="password"
        v-model="password"
        placeholder="Password"
        @keypress.enter="login"
        prepend-icon="mdi-lock"
        required
      />

      <br />

      <v-btn color="#60696c" width="100%" outlined @click="login">Login</v-btn>

      <br />
      <br />
      <h4 class="font-weight-light">
        Don't have an account?
        <router-link :to="{ name: 'CreateBusiness' }">
          Register as a Partner with us now!
        </router-link>
      </h4>
    </div>
  </v-row>
</template>

<script>
/**
 * @Todo - Add in browser's "required" attribute checker for input.
 */

import firebase from "firebase/app";
import "firebase/auth";

// Function to map a given err.code and return a user friendly message
const getErrorMessage = (err) =>
  ({
    "auth/wrong-password": "Invalid password or email!",
    "auth/network-request-failed": "Oops, check your internet connection!",
    "auth/user-not-found":
      "Sorry but you dont have an account with us 😭<br />Signup now!",
  }[err.code]);

export default {
  name: "login",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    back() {
      this.$router.push({ name: "welcome" });
    },
    async login() {
      // Show loading screen before login logic executes
      const loaderRequestID = this.$loader.new();

      try {
        // eslint-disable-next-line no-unused-vars
        const usr = await firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password);

        /* Dispatch signin action and redirect to homescreen after auth process completes */
        this.$store.dispatch("signin", this.email);
        this.$router.replace({ name: "home" });
      } catch (error) {
        // If there is an error but user is somehow logged in, sign user out to try again
        if (firebase.auth().currentUser) await firebase.auth().signOut();

        // Create new user error and show with ErrorDialog
        const userError = this.$error.createError(
          this.$error.ERROR.level.RETRY,
          // @todo Change this to use the AUTH error type then
          this.$error.ERROR.custom(
            "Authentication Failed",
            getErrorMessage(error) || error.message
          )
        );
        this.$error.new(userError);
      } finally {
        // Remove loader after login logic completes regardless of whether login failed or succeeded
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

.login {
  flex-direction: column;

  align-items: center;

  position: absolute;
  top: 8vh;
  left: 38%;
  right: 38%;
  bottom: 10vh;
}
</style>
