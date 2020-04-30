<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">Contact Us</v-btn>
      </template>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Raise a ticket</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <!-- TODO: fix send here to be disabled when first opened -->
            <v-btn v-if="valid == false" disabled dark text>Send</v-btn>
            <v-btn v-else dark text @click="dialog = false, snackbar = true">Send</v-btn>
            <!-- Link to actual function -->
          </v-toolbar-items>
        </v-toolbar>
        <!-- <v-list three-line subheader>
          <v-subheader>User Controls</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Password</v-list-item-title>
              <v-list-item-subtitle>Require password for purchase or use password to restrict purchase</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>-->
        <v-divider></v-divider>
        <v-list three-line subheader>
          <v-subheader>General</v-subheader>
          <v-list-item>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field v-model="name" :counter="10" :rules="nameRules" label="Name" required></v-text-field>

              <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>

              <v-select
                v-model="select"
                :items="items"
                :rules="[v => !!v || 'Item is required']"
                label="Ticket Topic"
                required
              ></v-select>

              <v-checkbox
                v-model="checkbox"
                :rules="[v => !!v || 'You give consent to continue!']"
                required
                label="I hereby consent to the Class Express Support Team to contacting me at the above given email address."
              ></v-checkbox>
              <br />

              <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">Validate</v-btn>

              <v-btn color="error" class="mr-4" @click="reset">Reset Form</v-btn>

              <v-btn color="warning" @click="resetValidation">Reset Validation</v-btn>
            </v-form>
          </v-list-item>
          <v-list-item>
            <!-- <v-list-item-action>
              <v-checkbox v-model="Agree"></v-checkbox>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Consent to contact</v-list-item-title>
              <v-list-item-subtitle>I hereby consent to the Class Express Support Team to contacting me at the above given email address.</v-list-item-subtitle>
            </v-list-item-content>-->
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ snackbarText }}
      <v-btn color="blue" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <br />
  </v-row>
</template>

<script>
export default {
  name: "contact-us",
  data() {
    return {
      snackbar: false,
      snackbarText: "Your ticket has been sent to the support team!",
      snackbarTimeOut: 2000,
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      valid: false,
      name: "",
      nameRules: [
        v => !!v || "Name is required",
        v => (v && v.length <= 10) || "Name must be less than 10 characters"
      ],
      email: "",
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ],
      select: null,
      items: [
        "Account",
        "Billing",
        "Application",
        "General/Misc",
        "Partner/Provider",
        "Others"
      ],
      checkbox: false
    };
  },

  methods: {
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    }
  }
};
</script>