<template>
  <v-main id="login">
    <v-img
      alt="ClassExpress logo"
      src="../assets/logo.png"
      max-height="calc(100% - 1em)"
      max-width="calc(100% - 1em)"
    />

    <input
      v-autofocus
      type="text"
      v-model="email"
      placeholder="Email"
      @keypress.enter="login"
      required
    />
    <br />
    <input
      type="password"
      v-model="password"
      placeholder="Password"
      @keypress.enter="login"
      required
    />

    <v-btn @click="login" width="calc(100% - 6em)" color="blue darken-1" dark>
      Login
    </v-btn>

    <br />
    <br />

    <v-btn @click="back" width="calc(100% - 6em)" color="grey" dark>
      back
    </v-btn>

    <br />
    <br />

    <div style="text-align: left; margin-left: 3em; opacity: 0.8">
      Dont have an account?
    </div>
    <v-btn
      :to="{ name: 'signup' }"
      width="calc(100% - 6em)"
      color="green darken-1"
      dark
    >
      Signup now!
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

      /*
        @todo Disable the login/signup up buttons or some code here to prevent this from being called more then once

        To prevent:
        - double call to login
        - double navigation to the same route
      */

      try {
        // eslint-disable-next-line no-unused-vars
        const usr = await firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password);

        if (!firebase.auth().currentUser.emailVerified) {
          // Throw new error with pre-defined code to get the right error_msg
          const error = new Error();
          error.code = "email/no-verify";
          throw error;
        }

        // Await for async dispatch to ensure app only starts after user info is available.
        await this.$store.dispatch("getUserDetails", this.email);
        this.$store.dispatch("init");

        // Route to the user's home page, after login
        this.$router.replace({ name: "home" });
      } catch (error) {
        // Only resend verification email if needed, but both will end early after signout without continuing to normal error handling
        if (error.code === "email/no-verify") {
          if (
            confirm(
              "Please verify your email first! Resend verification email?"
            )
          )
            firebase.auth().currentUser.sendEmailVerification();
          return await firebase.auth().signOut();
        }

        // If there is an error but user is somehow logged in, sign user out to try again
        if (firebase.auth().currentUser) await firebase.auth().signOut();

        // Create new user error and show with ErrorDialog
        const userError = this.$error.createError(
          this.$error.ERROR.level.RETRY,
          // @todo Update this to use the AUTH error type, perhaps combine with error.new? Why create this var?
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
input {
  margin: 0.4em 0;
  padding: 1em;

  width: calc(100% - 6em);

  border: 1px solid turquoise;
  border-radius: 0.4em;
}

.error {
  margin-top: 1em;
  margin-bottom: 1em;
}
</style>
