<template>
  <div class="signup">
    <img alt="Login image" src="../assets/logo.png" width="360" height="360" />

    <h2>Hello! Plz login after<br />verifying ur emailz</h2>

    <br />
    <br />

    <v-btn color="orange" @click="resendVerificationEmail">
      resend verification email
    </v-btn>

    <br />
    <br />

    <v-btn color="primary" :to="{ name: 'login' }">login</v-btn>
  </div>
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

<style scoped>
img {
  background-size: cover;
}
</style>
