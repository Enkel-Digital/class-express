<template>
  <v-app id="app">
    <!-- Router view always on top -->
    <v-content>
      <router-view />
    </v-content>

    <!-- Bottom navigation bar stays the same across the screens -->
    <v-bottom-navigation app v-if="showNavBar">
      <v-btn to="/">
        <span>Home</span>
        <v-icon>mdi-home</v-icon>
      </v-btn>

      <v-btn to="/explore">
        <span>Explore</span>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn to="/upcoming">
        <span>Upcoming</span>
        <v-icon>mdi-calendar-today</v-icon>
      </v-btn>

      <v-btn to="/profile">
        <span>Profile</span>
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
import AuthType from "@/router/AuthType";

export default {
  name: "App",
  computed: {
    showNavBar() {
      return this.$route.meta.Auth_requirements !== AuthType.public_only;
    }
  }
};
</script>

<style>
/* Basic default styles applied throughout the app */
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
