<template>
  <v-row justify="center">
    <div class="login">
      <img
        alt="Login image"
        src="../assets/logo.png"
        width="360"
        height="360"
      />

      <v-text-field
        v-autofocus
        type="text"
        v-model="email"
        placeholder="Username"
        @keypress.enter="login"
        required
      />

      <v-text-field
        type="password"
        v-model="password"
        placeholder="Password"
        @keypress.enter="login"
        required
      />

      <br />

      <v-btn color="#60696c" width="30em" outlined @click="login">Login</v-btn>

      <br />
      <br />
      <h4 class="font-weight-light">
        Don't have an account?
        <router-link :to="{ name: 'signup' }">
          Sign up here!
        </router-link>
      </h4>

      <!-- <v-btn id="back-btn" color="#60696c" width="20em" outlined @click="back"
        >Back</v-btn
      > -->
    </div>
  </v-row>
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
      return "Invalid password or email!";
    case "auth/network-request-failed":
      return "Oops, check your internet connection!";
    case "auth/user-not-found":
      return "Sorry but you dont have an account with us 😭<br />Signup now!";
    case "email/no-verify":
      return "Email not verified.<br />Please verify before trying again";
    default:
      return "Something went wrong! Please try again.";
  }
}

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

        if (!firebase.auth().currentUser.emailVerified) {
          // Signout the user and redirect to verifyEmail view
          await firebase.auth().signOut();

          // Throw new error with pre-defined code to get the right error_msg
          const error = new Error();
          error.code = "email/no-verify";
          throw error;
        } else {
          // Await for async dispatch to ensure app only starts after user info is available.
          await this.$store.dispatch("getUserDetails", this.email);
          this.$store.dispatch("init");

          // Route to the user's home page, after login
          this.$router.replace({ name: "home", params: { user: name } });
        }
      } catch (error) {
        // If there is an error but user is somehow logged in, sign user out to try again
        if (firebase.auth().currentUser) await firebase.auth().signOut();

        // @todo Instead of changing route, perhaps, show via ErrorDialog and let user know they need to verify their email
        // @todo Then use internal notification dialog to show email verification after user signup.
        if (error.code === "email/no-verify")
          return this.$router.replace({
            name: "verify-email",
            params: { emailAddress: this.email },
          });

        // Create new user error and show with ErrorDialog
        const userError = this.$error.createError(
          this.$error.ERROR.level.RETRY,
          this.$error.ERROR.custom("Authentication Failed", error_msg(error))
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
  /* display: flex; */
  flex-direction: column;

  align-items: center;

  position: absolute;
  top: 10vh;
  left: 35%;
  right: 35%;
  bottom: 10vh;
}
</style>
