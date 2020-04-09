<template>
  <div class="signup">
    <img alt="Login image" src="../assets/logo.png" width="360" height="360" />

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
    <button @click="signUp">Sign Up</button>
    <br />
    <button id="back-btn" @click="back">Back</button>
  </div>
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
