<template>
  <v-main id="welcome">
    <!-- Is the eager tag preventing the splash from loading? maybe not, since when logged in alr, it still does not load -->
    <v-img
      eager
      alt="ClassExpress logo"
      src="../assets/logo.png"
      max-height="calc(100% - 1em)"
      max-width="calc(100% - 1em)"
      style="margin-top: calc(20%)"
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

    <div
      style="
        position: absolute;
        bottom: 1vh;
        font-size: 0.6em;
        text-align: center;
      "
    >
      <p>version: {{ buildTime + " " + commitHash.slice(0, 6).toString() }}</p>
    </div>
  </v-main>
</template>

<script>
export default {
  name: "welcome",
  data() {
    return {
      buildTime: process.env.buildTime,
      commitHash: process.env.commitHash,
    };
  },
};
</script>
