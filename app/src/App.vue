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

// @todo Use a plugin instead of writing this myself
import InternalNotificationDialog from "@/components/InternalNotificationDialog";

export default {
  name: "App",
  components: {
    BottomNavBar,
    InternalNotificationDialog,
  },
  computed: {
    // @todo Remove this and rely on router to pass in prop to decide if nav bar should be shown
    // Else specifying showNavBar in route.meta.showNavBar is also a viable option.
    showNavBar() {
      return this.$route.meta.Auth_requirements !== AuthType.public_only;
    },
  },
};
</script>

<style scoped>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>

<style>
/* Basic default styles applied throughout the app */

/*
  Temporary fix for buggy word wrap in cards. Refer to issue and solution.
  https://github.com/vuetifyjs/vuetify/issues/9130#issuecomment-542534966
 */
.v-card__text,
.v-card__title {
  word-break: normal !important;
}
</style>
