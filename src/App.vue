<template>
  <v-app id="app">
    <ErrorDialog />
    <Loader />

    <!-- Router view for the main view -->
    <router-view />

    <BottomNavBar v-if="showNavBar" />
  </v-app>
</template>

<script>
import AuthType from "@/router/AuthType";
import BottomNavBar from "@/components/BottomNavBar";
import ErrorDialog from "@/components/ErrorDialog";
import Loader from "@/components/Loader";

export default {
  name: "App",
  components: {
    BottomNavBar,
    ErrorDialog,
    Loader
  },
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
