<template>
  <v-app id="app">
    <ErrorDialog />
    <Loader />

    <SideNavBar v-if="signedInRoute" />

    <v-app-bar
      v-if="signedInRoute"
      app
      dark
      flat
      :clipped-left="true"
      color="#546E7A"
    >
      <v-app-bar-nav-icon @click="$router.push({ name: 'home' })">
        <v-avatar size="2.6em" item>
          <v-img src="@/assets/logo.png" alt="Logo" />
        </v-avatar>
      </v-app-bar-nav-icon>

      <span style="width: 250px;"> </span>

      <v-text-field
        flat
        solo-inverted
        hide-details
        dense
        prepend-inner-icon="mdi-magnify"
        color="#CFD8DC"
        label="Search"
      />

      <v-spacer />

      <!-- 
      <v-btn icon>
        <v-icon color="#CFD8DC">mdi-apps</v-icon>
      </v-btn> -->

      <v-btn icon>
        <v-icon color="#CFD8DC">mdi-bell</v-icon>
      </v-btn>

      <!-- @todo Remove before production -->
      <v-btn icon large @click="$store.dispatch('init')">
        <v-icon>
          mdi-reload
        </v-icon>
      </v-btn>
    </v-app-bar>

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
    SideNavBar,
  },
  computed: {
    // Compute if user is on a route that is only available after signing in.
    // @todo Change to be passed in from the router config instead of using computed property
    signedInRoute() {
      return this.$route.meta.Auth_requirements !== AuthType.public_only;
    },
  },
};
</script>

<style scoped>
/* Basic default styles applied throughout the app */
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
.my-menu {
  margin-top: 40px;
  contain: initial;
  overflow: visible;
}
.my-menu::before {
  position: absolute;
  content: "";
  top: 0;
  right: 10px;
  transform: translateY(-100%);
  width: 10px;
  height: 13px;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 13px solid #fff;
}
span {
  width: 20px;
}
</style>
