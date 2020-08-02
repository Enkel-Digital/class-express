<template>
  <div class="verifyEmail" id="verify-email">
    <v-img
      max-width="25em"
      max-height="25em"
      alt="ClassExpress logo"
      src="../assets/logo.png"
    />

    <h2 class="font-weight-light">
      hello! please check your inbox and verify your email! ☻
    </h2>

    <br />
    <br />

    <v-btn
      @click="resendVerificationEmail"
      width="30em"
      color="#60696c"
      outlined
    >
      resend verification email
    </v-btn>

    <br />

    <v-btn :to="{ name: 'login' }" width="30em" color="#60696c" outlined dark>
      Login
    </v-btn>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";

export default {
  name: "verifyEmail",
  data() {
    return {
      // Timeout data object that can be referenced to clear if user navigates away before timeout
      timeout: setTimeout(
        (router) => router.push({ name: "login" }), // Redirect user to login view
        10000,
        this.$router
      ),
    };
  },
  methods: {
    resendVerificationEmail() {
      // Prevent timeout from routing to login if user request for a new verification email
      clearTimeout(this.timeout);

      if (confirm("Resend verification email?"))
        firebase.auth().currentUser.sendEmailVerification();
    },
  },
  beforeDestroy() {
    // Prevent the timeout from routing to login if user already navigated away themselves
    clearTimeout(this.timeout);
  },
};
</script>

<style scoped>
.verifyEmail {
  display: flex;
  flex-direction: column;

  align-items: center;

  position: absolute;
  top: 10vh;
  left: 25%;
  right: 25%;
  bottom: 10vh;
}
</style>
