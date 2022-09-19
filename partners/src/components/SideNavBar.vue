<template>
  <v-navigation-drawer
    id="side-nav-bar"
    v-model="drawer"
    :mini-variant.sync="mini"
    permanent
    :clipped="true"
    app
  >
    <!-- @todo Make this section clickable and link to account page of settings -->
    <v-list-item class="px-2" two-line>
      <v-list-item-avatar>
        <img
          alt="Avatar"
          :src="'https://avatars2.githubusercontent.com/u/44993072?s=460'"
        />
      </v-list-item-avatar>

      <v-list-item-content>
        <!-- Indicate whether the user is an admin or employee -->
        <p class="overline">{{ user.admin ? "Admin" : "Employee" }}</p>

        <v-list-item-title>{{ user.name }}</v-list-item-title>

        <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
      </v-list-item-content>

      <v-btn icon @click.stop="mini = !mini">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-list-item>

    <v-divider />

    <!-- Items in the side nav bar -->
    <v-list dense>
      <v-list-item
        exact
        ripple
        v-for="item in defaultTabs"
        :key="item.title"
        :to="item.link"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-subheader>Finance</v-subheader>
      <v-list-item
        exact
        ripple
        v-for="item in financeTabs"
        :key="item.title"
        :to="item.link"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-subheader>Classes</v-subheader>
      <v-list-item
        exact
        ripple
        v-for="item in classTabs"
        :key="item.title"
        :to="item.link"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-subheader>General</v-subheader>
      <v-list-item
        exact
        ripple
        v-for="item in user.admin
          ? generalTabs
          : generalTabs.filter((tab) => !tab.adminOnly)"
        :key="item.title"
        :to="item.link"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item ripple hover @click="logout">
        <v-list-item-icon>
          <v-icon>mdi-logout</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
// UI reference link https://github.com/vuetifyjs/vuetify/blob/master/packages/docs/src/layouts/layouts/demos/google-contacts.vue

import { mapState } from "vuex";
import logout from "@/controllers/logout";

export default {
  name: "side-nav-bar",
  data() {
    return {
      drawer: true,
      mini: false,
      defaultTabs: [
        {
          icon: "mdi-monitor-dashboard",
          text: "Dashboard",
          link: { name: "home" },
        },
        {
          icon: "mdi-calendar-month",
          text: "Schedule",
          link: { name: "view-schedule" },
        },
      ],
      classTabs: [
        {
          icon: "mdi-view-list",
          text: "All Classes",
          link: { name: "all-classes" },
        },
        {
          icon: "mdi-plus",
          text: "Add New Class",
          link: { name: "new-class" },
        },
        {
          icon: "mdi-calendar-clock",
          text: "Bookings",
          link: { name: "bookings" },
        },
        {
          icon: "mdi-message-draw",
          text: "Reviews",
          link: { name: "all-reviews" },
        },
      ],
      financeTabs: [
        {
          icon: "mdi-cash-usd",
          text: "Earnings",
          link: { name: "earnings" },
        },
        {
          icon: "mdi-card-text",
          text: "Withdrawal",
          link: { name: "withdrawal" },
        },
      ],
      generalTabs: [
        {
          icon: "mdi-account",
          text: "Company Profile",
          link: { name: "partnerProfile" },
          adminOnly: true,
        },
        {
          icon: "mdi-account-group",
          text: "Manage Employee",
          link: { name: "manage-employee" },
          adminOnly: true,
        },
        {
          icon: "mdi-help-circle",
          text: "FAQs",
          link: { name: "faq" },
        },
        {
          icon: "mdi-chat",
          text: "Contact Support",
          link: { name: "contact-support" },
        },
        {
          icon: "mdi-cog",
          text: "Settings",
          link: { name: "settings" },
        },
      ],
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    logout,
  },
};
</script>

<style scoped>
#side-nav-bar {
  text-align: left;
}
body {
  overflow: hidden;
  height: 100vh;
}
</style>
