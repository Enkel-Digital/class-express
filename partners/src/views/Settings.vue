<template>
  <v-content class="settings">
    <!-- Add a loader banner showing the update process and notify user if failed. -->

    <v-app-bar app color="orange lighten-1" flat dark fixed>
      <BackBtn />
      <v-toolbar-title>Settings</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-app-bar>

    <v-list>
      <v-subheader>
        Account Details
      </v-subheader>

      <v-list-item ripple>
        Update your email
        <v-spacer />
        <v-icon>mdi-chevron-right</v-icon>
      </v-list-item>

      <v-list-item ripple>
        Update your number
        <v-spacer />
        <v-icon>mdi-chevron-right</v-icon>
      </v-list-item>

      <v-list-item ripple>
        Emergency Contact
        <v-spacer />
        <v-icon>mdi-chevron-right</v-icon>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list>
      <v-subheader colors="orange">
        Notifications:
      </v-subheader>

      <div
        v-ripple
        @click="
          settings.notifications.mobileNotification = !settings.notifications
            .mobileNotification
        "
      >
        <v-checkbox
          v-model="settings.notifications.mobileNotification"
          readonly
          label="Mobile notifications"
          class="ma-1 pa-0"
        ></v-checkbox>
      </div>

      <div
        v-ripple
        @click="
          settings.notifications.emailNotification = !settings.notifications
            .emailNotification
        "
      >
        <v-checkbox
          v-model="settings.notifications.emailNotification"
          readonly
          label="Email notifications"
          class="ma-1 pa-0"
        ></v-checkbox>
      </div>
    </v-list>

    <v-divider></v-divider>

    <v-list>
      <v-subheader>
        Billing:
      </v-subheader>

      <v-list-item ripple>
        See Billing info
        <v-spacer />
        <v-icon>mdi-chevron-right</v-icon>
      </v-list-item>

      <v-list-item ripple>
        View recent charges
        <v-spacer />
        <v-icon>mdi-chevron-right</v-icon>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list>
      <v-subheader>
        Support
      </v-subheader>

      <v-list-item ripple>
        Visit our F.A.Q page
        <v-spacer />
        <v-icon>mdi-chevron-right</v-icon>
      </v-list-item>

      <v-list-item ripple>
        Request for Support
        <v-spacer />
        <v-icon>mdi-chevron-right</v-icon>
      </v-list-item>

      <!-- Opens as a dropdown menu with our contact number and email -->
      <v-list-item ripple>
        Contact us!
        <v-spacer />
        <v-icon>mdi-chevron-right</v-icon>
      </v-list-item>

      <!-- Direct to website with this content -->
      <v-list-item ripple>
        <span
          style="text-align: left; color: rgba(0, 0, 0, 0.6);"
          v-html="
            `Terms & Conditions
            <br />
            Community Guidelines`
          "
        ></span>
        <v-spacer />
        <v-icon>mdi-chevron-right</v-icon>
      </v-list-item>

      <!-- Direct to website with this content -->
      <v-list-item ripple>
        <span style="color: rgba(0, 0, 0, 0.6);">Privacy Policy</span>
        <v-spacer />
        <v-icon>mdi-chevron-right</v-icon>
      </v-list-item>
    </v-list>

    <v-list>
      <v-list-item @click="logout" ripple style="background-color: #ededed;">
        Logout
      </v-list-item>
    </v-list>
  </v-content>
</template>

<script>
/**
 * @todo https://vuetifyjs.com/en/components/expansion-panels/
 * @todo Use this https://vuetifyjs.com/en/components/lists/#expansion-lists for some of the nested settings
 *      Or perhaps use a diff view with nested routes.
 */

import logout from "@/controllers/logout";
import BackBtn from "@/components/BackBtn";
import { mapState } from "vuex";

export default {
  name: "settings",
  components: {
    BackBtn
  },
  data() {
    // Use JSONify since the values in state are all JSONifyable without any complex structures.
    const settings = JSON.parse(
      JSON.stringify(this.$store.state.settings.settings)
    );

    return {
      // settingsChanged: false,
      settings
    };
  },
  watch: {
    settings: {
      deep: true,
      handler() {
        console.log("settings changed");
        this.$store.dispatch("settings/updateSettings", this.settings);
      }
    }
  },
  methods: {
    logout
  }
};
</script>

<style scoped></style>
