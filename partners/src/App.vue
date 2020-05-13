<template>
  <v-app id="app">
    <SideNavBar v-if="signedInRoute" />

    <v-app-bar
      v-if="signedInRoute"
      app
      dark
      flat
      :clipped-left="true"
      color="#546E7A"
    >
      <!-- No toggling for now -->
      <!-- <v-app-bar-nav-icon @click.stop="showDrawer = !showDrawer"> -->
      <v-app-bar-nav-icon @click="$router.push({ name: 'home' })">
        <v-avatar size="2.6em" item>
          <v-img src="@/assets/logo.png" alt="Logo" />
        </v-avatar>
      </v-app-bar-nav-icon>

      <span />

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

      <v-btn class="ma-2" outlined color="#CFD8DC">
        <v-icon left>mdi-cellphone-link</v-icon>APP Download</v-btn
      >
      <!-- 
      <v-btn icon>
        <v-icon color="#CFD8DC">mdi-apps</v-icon>
      </v-btn> -->

      <v-btn icon>
        <v-icon color="#CFD8DC">mdi-bell</v-icon>
      </v-btn>

      <v-menu bottom left content-class="my-menu">
        <template v-slot:activator="{ on }">
          <v-btn dark icon v-on="on" color="#CFD8DC">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="(item, i) in items" :key="i">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Router view for the main view -->
    <router-view />

    <!-- Trigger to create a new class -->
    <!-- <v-btn bottom color="pink" dark fab fixed right @click="dialog = !dialog">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" width="800px">
      <v-card>
        <v-card-title class="grey darken-2">
          Create contact
        </v-card-title>
        <v-container>
          <v-row class="mx-2">
            <v-col class="align-center justify-space-between" cols="12">
              <v-row align="center" class="mr-0">
                <v-avatar size="40px" class="mx-3">
                  <img
                    src="//ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png"
                    alt=""
                  />
                </v-avatar>
                <v-text-field placeholder="Name" />
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-text-field
                prepend-icon="mdi-account-card-details-outline"
                placeholder="Company"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field placeholder="Job title" />
            </v-col>
            <v-col cols="12">
              <v-text-field prepend-icon="mdi-mail" placeholder="Email" />
            </v-col>
            <v-col cols="12">
              <v-text-field
                type="tel"
                prepend-icon="mdi-phone"
                placeholder="(000) 000 - 0000"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field prepend-icon="mdi-text" placeholder="Notes" />
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-btn text color="primary">More</v-btn>
          <v-spacer />
          <v-btn text color="primary" @click="dialog = false">Cancel</v-btn>
          <v-btn text @click="dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>-->
  </v-app>
</template>

<script>
import AuthType from "@/router/AuthType";
import SideNavBar from "@/components/SideNavBar";

export default {
  name: "App",
  data() {
    return {
      items: [
        { title: "Settings" },
        { title: "Contact Support" },
        { title: "Logout" },
      ],
    };
  },
  components: {
    SideNavBar,
  },
  computed: {
    // Compute if user is on a route that is only available after signing in.
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
