<template>
  <v-content class="settings" v-touch="{ right: () => $router.back() }">
    <v-app-bar app color="orange lighten-1" flat dark fixed>
      <BackBtn />
      <v-toolbar-title>Settings</v-toolbar-title>

      <v-spacer />

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

      <v-list-item>
        <!-- Click your Profile picture to change it -->
        <v-file-input
          :rules="avatarRules"
          accept="image/png, image/jpeg, image/bmp"
          placeholder="Pick an avatar"
          prepend-icon="mdi-camera"
          label="Avatar"
        />
      </v-list-item>
    </v-list>

    <v-divider />

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
        />
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
        />
      </div>
    </v-list>

    <v-divider />

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

    <v-divider />

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
        />
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

import { Touch } from "vuetify/lib/directives";
import logout from "@/controllers/logout";
import BackBtn from "@/components/BackBtn";
import { mapState } from "vuex";
import cloneDeep from "lodash.clonedeep";

export default {
  name: "settings",
  directives: {
    Touch,
  },
  components: {
    BackBtn,
  },
  data() {
    // @notice Can use JSONify too since values in state are all JSONifyable without any complex structures.
    const settings = cloneDeep(this.$store.state.settings.settings);

    return {
      settings,
      // Rules for the avatar image upload
      avatarRules: [
        (value) =>
          !value ||
          value.size < 2000000 ||
          "Avatar size should be less than 2 MB!",
      ],
    };
  },
  watch: {
    settings: {
      // Deep watch to watch the nested properties too
      deep: true,
      handler() {
        // Update the settings by passing in the whole settings object
        this.$store.dispatch("settings/updateSettings", this.settings);
      },
    },
  },
  methods: {
    logout,
  },
};
</script>
