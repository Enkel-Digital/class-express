<template>
  <v-app id="app">
    <SideNavBar v-if="sideNavBar" />

    <!-- Router view for the main view -->
    <router-view />
  </v-app>
</template>

<script>
import AuthType from "@/router/AuthType";
import SideNavBar from "@/components/SideNavBar";
export default {
  name: "App",
  components: {
    SideNavBar
  },
  computed: {
    sideNavBar() {
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
