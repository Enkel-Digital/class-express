<template>
  <v-content id="verify-email">
    <v-img alt="ClassExpress logo" src="../assets/logo.png" />

    <h2>Hello! Plz login after<br />verifying ur emailz</h2>

    <br />
    <br />

    <v-btn
      @click="resendVerificationEmail"
      width="calc(100% - 5em)"
      color="orange darken-1"
    >
      resend verification email
    </v-btn>

    <br />
    <br />

    <v-btn
      :to="{ name: 'login' }"
      width="calc(100% - 5em)"
      color="blue darken-2"
      dark
    >
      Login
    </v-btn>
  </v-content>
</template>

<script>
import { auth } from "firebase";

export default {
  name: "verifyEmail",
  data() {
    return {
      // Timeout data object that can be referenced to clear if user navigates away before timeout
      timeout: setTimeout(
        router => router.push({ name: "login" }), // Redirect user to login view
        10000,
        this.$router
      )
    };
  },
  methods: {
    resendVerificationEmail() {
      // Prevent timeout from routing to login if user request for a new verification email
      clearTimeout(this.timeout);

      if (confirm("Resend verification email?"))
        auth().currentUser.sendEmailVerification();
    }
  },
  beforeDestroy() {
    // Prevent the timeout from routing to login if user already navigated away themselves
    clearTimeout(this.timeout);
  }
};
</script>
