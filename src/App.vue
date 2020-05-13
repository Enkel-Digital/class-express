<template>
  <v-app id="app">
    <!-- @todo
      Make these modals conditional and hirechal
      error first then loader then notifications
    -->
    <ErrorDialog />
    <Loader />
    <InternalNotificationDialog />

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
import InternalNotificationDialog from "@/components/InternalNotificationDialog";

export default {
  name: "App",
  components: {
    BottomNavBar,
    ErrorDialog,
    Loader,
    InternalNotificationDialog
  },
  computed: {
    // @todo Remove this and rely on router to pass in prop to decide if nav bar should be shown
    // Else specifying showNavBar in route.meta.showNavBar is also a viable option.
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
