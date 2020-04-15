<template>
  <v-navigation-drawer :clipped="true" app>
    <!-- @todo Make this section clickable and link to account page of settings -->
    <v-list-item two-line>
      <!-- @todo Add a toggle, this might not be available -->
      <v-list-item-avatar size="60">
        <img
          alt="Avatar"
          :src="'https://avatars2.githubusercontent.com/u/44993072?s=460'"
        />
      </v-list-item-avatar>

      <v-list-item-content>
        <p class="overline">Account</p>

        <v-list-item-title>
          {{ "JJ Lee" }}
        </v-list-item-title>

        <v-list-item-subtitle>
          {{ "JJ@enkeldigital.com" }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider />

    <v-list dense>
      <v-list-item
        ripple
        v-for="item in items"
        :key="item.title"
        @click="item.link"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- <v-list-group
        v-if="item.children"
        :key="item.text"
        v-model="item.model"
        :prepend-icon="item.model ? item.icon : item['icon-alt']"
        append-icon=""
      >
        <v-list-item v-for="(child, i) in item.children" :key="i" link>
          <v-list-item-action>
            <v-icon>{{ child.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ child.text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group> -->
    </v-list>
  </v-navigation-drawer>
</template>

<script>
// https://github.com/vuetifyjs/vuetify/blob/master/packages/docs/src/layouts/layouts/demos/google-contacts.vue

export default {
  name: "side-nav-bar",
  data() {
    return {
      items: [
        { icon: "mdi-view-dashboard", text: "Dashboard", link: "./" },
        { icon: "mdi-view-dashboard", text: "Earnings", link: "./" },
        { icon: "mdi-calendar", text: "View Schedule", link: "./" },
        { icon: "mdi-plus", text: "Add New Class", link: "./" },
        { icon: "mdi-view-week", text: "Edit Class", link: "./" },
        { icon: "mdi-account", text: "View Reviews", link: "./" },
        { icon: "mdi-account-group-outline", text: "Withdrawal", link: "./" },
        {
          icon: "mdi-chevron-up",
          "icon-alt": "mdi-chevron-down",
          text: "Labels",
          model: true,
          children: [
            { icon: "mdi-account-group-outline", text: "View all users" },
            { icon: "mdi-account-plus", text: "Add user" },
            { icon: "mdi-account-minus", text: "Delete user" }
          ]
        },
        {
          icon: "mdi-chevron-up",
          "icon-alt": "mdi-chevron-down",
          text: "More",
          model: false,
          children: [
            { text: "Import" },
            { text: "Export" },
            { text: "Print" },
            { text: "Undo changes" },
            { text: "Other contacts" }
          ]
        },
        { icon: "mdi-settings", text: "Settings" },
        { icon: "mdi-account", text: "Contact Support", link: "./" },
        { icon: "mdi-message", text: "Send feedback", link: "./" },
        { icon: "mdi-help-circle", text: "Help & FAQs" },
        { icon: "mdi-cellphone-link", text: "App downloads" }
      ]
    };
  }
};
</script>
