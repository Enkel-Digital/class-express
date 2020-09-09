<template>
  <v-main class="settings">
    <v-app-bar app color="orange lighten-1" flat dark fixed>
      <BackBtn />
      <v-toolbar-title>Settings</v-toolbar-title>

      <v-spacer />

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-app-bar>

    <v-list>
      <v-subheader>Account Details</v-subheader>

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
      <v-subheader colors="orange"> Notifications: </v-subheader>

      <div
        v-ripple
        @click="
          setter(settings, 'notification_mobile', !settings.notification_mobile)
        "
      >
        <v-checkbox
          v-model="settings.notification_mobile"
          readonly
          label="Mobile notification"
          class="ma-1 pa-0"
        />
      </div>

      <div
        v-ripple
        @click="
          setter(settings, 'notification_email', !settings.notification_email)
        "
      >
        <v-checkbox
          v-model="settings.notification_email"
          readonly
          label="Email notification"
          class="ma-1 pa-0"
        />
      </div>
    </v-list>

    <v-divider />

    <v-list>
      <v-subheader> Billing: </v-subheader>

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
      <v-subheader> Support </v-subheader>

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
          style="text-align: left; color: rgba(0, 0, 0, 0.6)"
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
        <span style="color: rgba(0, 0, 0, 0.6)">Privacy Policy</span>
        <v-spacer />
        <v-icon>mdi-chevron-right</v-icon>
      </v-list-item>
    </v-list>

    <v-list>
      <v-list-item @click="logout" ripple style="background-color: #ededed">
        Logout
      </v-list-item>
    </v-list>
  </v-main>
</template>

<script>
/**
 * @todo https://vuetifyjs.com/en/components/expansion-panels/
 * @todo Use this https://vuetifyjs.com/en/components/lists/#expansion-lists for some of the nested settings
 *      Or perhaps use a diff view with nested routes.
 *
 * @notice Settings object must be flat! Meaning all properties are top level and nesting is be done using "property-subproperty" string
 * @notice cannot use "property.subproperty" because it will mess with firebase update method.
 * @notice cannot use "property/subproperty" because firestore update() does not like it with the error below
 * @notice Update() requires either single JavaScript object or alternating list of field/value pairs ... ... Paths can't be empty and must not contain "*~/[]".
 */

import logout from "@/controllers/logout";
import BackBtn from "@/components/BackBtn";
import { mapState } from "vuex";
import cloneDeep from "lodash.clonedeep";

export default {
  name: "settings",
  created() {
    // Using created hook to ensure this is ran everyime this view is loaded/created
    // Request store to populate settings
    this.$store.dispatch("settings/init");
  },
  components: {
    BackBtn,
  },
  data() {
    return {
      // Rules for the avatar image upload
      avatarRules: [
        (value) =>
          !value ||
          value.size < 2000000 ||
          "Avatar size should be less than 2 MB!",
      ],
    };
  },
  computed: {
    settings: {
      get() {
        // Using deepclone/clone to ensure we can modify settings without directly modifying vuex state,
        // And only using the computed property to modify vuex state via an action.
        // Essentially the deepclone removes the reactive bindings on the data
        // Technically can use JSONify too since values in state should all be JSONifyable without any complex structures.
        // In case settings is null, use empty object to prevent breaking template with accessing properties of undefined errors
        return cloneDeep(this.$store.state.settings.settings) || {};
      },
      set(newSettings) {
        // Use a computed setter to modify vuex state through the syncSettings action instead of a direct modification
        this.$store.dispatch("settings/syncSettings", newSettings);
      },
    },
  },
  methods: {
    logout,
    // Setter method to allow us to modify the cloned settings object before assigning the settings object,
    // which will trigger the computed setter to save the new settings using an action
    setter(settings, key, value) {
      settings[key] = value;
      // Reassign needed to trigger computed setter since setter only watches for root level changes and not deep/nested changes
      this.settings = settings;
    },
  },
};
</script>
