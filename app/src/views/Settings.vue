<template>
  <v-content class="profile">
    <!-- Add a loader banner showing the update process and notify user if failed. -->

    <v-toolbar color="orange lighten-1" flat dark>
      <BackBtn />

      <v-toolbar-title>Settings</v-toolbar-title>

      <!-- <v-btn icon> -->
      <!-- <v-icon>mdi-magnify</v-icon> -->
      <!-- </v-btn> -->
    </v-toolbar>

    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-list>
          <v-subheader colors="orange">
            Notifications:
          </v-subheader>

          <div v-ripple @click="mobileNotification = !mobileNotification">
            <v-checkbox
              v-model="mobileNotification"
              readonly
              :label="'Mobile notifications'"
              class="ma-1 pa-0"
            ></v-checkbox>
          </div>

          <div v-ripple @click="emailNotification = !emailNotification">
            <v-checkbox
              v-model="emailNotification"
              readonly
              :label="'Email notifications'"
              class="ma-1 pa-0"
            ></v-checkbox>
          </div>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <v-subheader colors="orange">
            Billing:
          </v-subheader>

          <v-list-item ripple>
            See Billing info
          </v-list-item>

          <v-list-item ripple>
            View recent charges
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>

    <v-list-item @click="logout" ripple style="background-color: #ededed;">
      Logout
    </v-list-item>
  </v-content>
</template>

<script>
import logout from "@/controllers/logout";
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
    logout
  }
};
</script>

<style scoped></style>
