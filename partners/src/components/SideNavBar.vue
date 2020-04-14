<template>
  <v-container height="350px">
    <v-navigation-drawer absolute permanent left>
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar>
            <!-- TODO: Change Image to Profile Image -->
            <img src="https://randomuser.me/api/portraits/women/81.jpg" />
          </v-list-item-avatar>

          <v-list-item-content>
            <!-- TODO: Change Name too -->
            <v-list-item-title>Jane Smith</v-list-item-title>
            <v-list-item-subtitle>Logged In</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          @click="item.linksTo"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
export default {
  name: "sideNavigationBar",
  data() {
    return {
      items: [
        { title: "View Schedule", icon: "mdi-home-city", linksTo: "./" },
        { title: "Earnings", icon: "mdi-account", linksTo: "./" },
        {
          title: "Withdrawal",
          icon: "mdi-account-group-outline",
          linksTo: "./"
        },
        { title: "Add New Class", icon: "mdi-account", linksTo: "./" },
        { title: "Edit Class", icon: "mdi-account", linksTo: "./" },
        { title: "View Reviews", icon: "mdi-account", linksTo: "./" },
        { title: "FAQs", icon: "mdi-account", linksTo: "./" },
        { title: "Contact Support", icon: "mdi-account", linksTo: "./" }
      ]
    };
  }
};
</script>
>
