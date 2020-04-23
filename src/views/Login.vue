<template>
  <v-content id="login">
    <v-img
      eager
      alt="ClassExpress logo"
      src="../assets/logo.png"
      max-height="calc(100% - 1em)"
      max-width="calc(100% - 1em)"
    />

    <input
      v-autofocus
      type="text"
      v-model="email"
      placeholder="Username"
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

    <p class="error">{{ error_msg }}</p>

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

    <div style="text-align: left; margin-left: 3em; opacity: 0.8;">
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
  </v-content>
</template>

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
    case "auth/network-request-failed":
      return "Oops, check your internet connection!";
    case "email/no-verify":
      return "Email not verified. Please verify before trying again";
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
      error_msg: ""
    };
  },
  methods: {
    back() {
      this.$router.push({ name: "welcome" });
    },
    async login() {
      try {
        // @todo Show loading screen while authenticating and loading user data

        // eslint-disable-next-line no-unused-vars
        const usr = await auth().signInWithEmailAndPassword(
          this.email,
          this.password
        );

        const headers = {
          Authorization: `Bearer ${await auth().currentUser.getIdToken()}`
        };

        console.log("verified", auth().currentUser.emailVerified);

        if (!auth().currentUser.emailVerified) {
          // Signout the user and redirect to verifyEmail view
          await auth().signOut();

          // Throw new error with pre-defined code to get the right error_msg
          const error = new Error();
          error.code = "email/no-verify";
          throw error;
        } else {
          // Await for async dispatch to ensure app only starts when user info is all available.
          await this.$store.dispatch("getUserDetails");

          await this.$store.dispatch("init");

          // Route to the user's home page, after login
          this.$router.replace({ name: "home", params: { user: name } });
        }
      } catch (error) {
        // Set the message into the error box to show user the error
        this.error_msg = error_msg(error);
      }
    }
  }
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
