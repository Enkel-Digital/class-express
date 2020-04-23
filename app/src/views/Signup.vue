<template>
  <v-content id="signup">
    <v-img
      alt="ClassExpress logo"
      src="../assets/logo.png"
      max-height="calc(100% - 1em)"
      max-width="calc(100% - 1em)"
    />

    <input
      v-autofocus
      type="text"
      v-model="name"
      placeholder="Name"
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

    <p class="error">{{ error_msg }}</p>

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

    <div style="text-align: left; margin-left: 3em; opacity: 0.8;">
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
      email: "",
      password: "",
      error_msg: ""
    };
  },
  methods: {
    back() {
      this.$router.push({ name: "welcome" });
    },
    signUp: async function() {
      try {
        // After signup, user will be automatically signed in, redirect to home
        // eslint-disable-next-line no-unused-vars
        const usr = await auth().createUserWithEmailAndPassword(
          this.email,
          this.password
        );

        auth().currentUser.sendEmailVerification();

        // Store user details to use store to sync data with server.
        // @notice This must be completed before signing out since server needs auth verification.
        const storeUser = this.$store.state.user;
        storeUser.email = this.email;
        storeUser.name = this.name;
        this.$store.commit("setter", ["user", storeUser]);

        // Signout the user and redirect to verifyEmail view
        await auth().signOut();

        this.$router.replace({ name: "verify-email" });
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
