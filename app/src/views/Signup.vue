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

    <div id="termsAndCondition">
      *By creating an account, you agree to the
      <a href="https://terms.classexpress.com" target="_blank">
        terms and conditions
      </a>
    </div>

    <p class="error" v-html="error_msg" />

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

import firebase from "firebase/app";
import "firebase/auth";
import apiWithLoader from "@/store/utils/apiWithLoader";

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
      name: "",
      email: "",
      password: "",
      error_msg: "",
    };
  },
  methods: {
    back() {
      this.$router.push({ name: "welcome" });
    },
    signUp: async function () {
      try {
        // Make lowercase, refer to notes & faq on why this is lowercase.
        // tl;dr Firebase auth like google ignores the email RFC and forces email case-insensitivity
        this.email = this.email.toLowerCase();

        // Create new user and send them a email verification email
        await firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password);
        firebase.auth().currentUser.sendEmailVerification();

        const newUser = {
          // @todo Might need to destructure email and password from "this" then use it
          userID: this.email,
          user: {
            userID: this.email,
            email: this.email,
            name: this.name,
            fname: undefined,
            lname: undefined,
            imageSrc: undefined, // For now, user cannot upload image during signup
          },
        };

        // @todo Replace this with a mutation watcher?
        // This needs to be before signout, as we need the token to create a new user.
        // Not awaiting as we do not need its response to continue signup flow, signing user out and redirecting
        const res = apiWithLoader.post("/user/new", newUser);

        // // @todo Use this if mutation watcher is implemented.
        // // Store user details to use store to sync data with server.
        // // @notice This must be completed before signing out since server needs auth verification.
        // const storeUser = this.$store.state.user;
        // storeUser.email = this.email;
        // storeUser.name = this.name;
        // this.$store.commit("setter", ["user", storeUser]);

        // Sign user out and redirect to verifyEmail view
        await firebase.auth().signOut();

        this.$router.replace({ name: "verify-email" });
      } catch (error) {
        /**
         * If there is an error before user is signed out, sign user out to try again
         * @notice This is not ideal as if the store dispatch / API failed then user needs to login directly instead of retry.
         * @todo To optimize this.
         */
        if (firebase.auth().currentUser) await firebase.auth().signOut();

        // @todo Remove before production
        console.error(error);

        // Set the message into the error box to show user the error
        this.error_msg = error_msg(error);
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
