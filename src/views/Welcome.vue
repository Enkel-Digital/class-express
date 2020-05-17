<template>
  <v-content id="welcome">
    <v-img
      eager
      alt="ClassExpress logo"
      src="../assets/logo.png"
      max-height="calc(100% - 1em)"
      max-width="calc(100% - 1em)"
      style="margin-top: calc(20%);"
    />

    <v-btn
      :to="{ name: 'signup' }"
      width="calc(100% - 5em)"
      color="orange darken-1"
      dark
    >
      Sign Up
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
export default {
  name: "welcome",
};
</script>
