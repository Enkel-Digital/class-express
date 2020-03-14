<template>
  <v-content class="profile">
    <!-- Add a loader banner showing the update process and notify user if failed. -->

    <v-toolbar color="orange lighten-1" flat dark>
      <BackBtn class="ma-0 pa-0" />

      <v-toolbar-title>Settings</v-toolbar-title>

      <!-- <v-btn icon> -->
      <!-- <v-icon>mdi-magnify</v-icon> -->
      <!-- </v-btn> -->
    </v-toolbar>

    <br />

    <div>
      Notifications:
      <v-divider></v-divider>

      <v-checkbox
        v-model="mobileNotification"
        :label="'Enable mobile notifications'"
        class="ma-0 pa-0"
      ></v-checkbox>

      <v-checkbox
        v-model="emailNotification"
        :label="'Enable email notifications'"
        class="ma-0 pa-0"
      ></v-checkbox>
    </div>

    <v-divider></v-divider>

    <v-btn @click="logout">Logout</v-btn>
  </v-content>
</template>

<script>
import firebase from "firebase";
import BackBtn from "@/components/BackBtn";

export default {
  name: "profile",
  components: {
    BackBtn
  },
  data() {
    return {
      mobileNotification: true,
      emailNotification: true
    };
  },
  methods: {
    save() {},
    logout() {
      alert("You have now been logged out");

      // Signout current user and redirect to welcome page afterwards.
      firebase
        .auth()
        .signOut()
        .then(() => this.$router.push({ name: "welcome" }));
    }
  }
};
</script>

<style scoped></style>
