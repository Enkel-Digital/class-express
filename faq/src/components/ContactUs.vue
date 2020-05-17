<template>
  <v-row>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <!-- Activators the dialog page -->
      <template v-slot:activator="{ on }">
        <!-- How does this appear on the screen -->
        <v-btn color="white" text rounded class="my-2" v-on="on" @click="reset">Contact Us</v-btn>
      </template>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Raise a ticket</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items></v-toolbar-items>
        </v-toolbar>
        <v-divider></v-divider>
        <v-list three-line subheader>
          <v-subheader>General</v-subheader>
          <v-list-item>
            <!-- Form to fill in their support queries -->
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field v-model="name" :counter="10" :rules="nameRules" label="Name" required></v-text-field>
              <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
              <v-select
                v-model="select"
                :items="items"
                :rules="[v => !!v || 'Topic is required']"
                label="Ticket Topic"
                required
              ></v-select>
              <v-checkbox
                v-model="checkbox"
                :rules="[v => !!v || 'You must give consent to continue!']"
                required
                label="I hereby consent to the Class Express Support Team to contacting me at the above given email address."
              ></v-checkbox>
              <div v-if="validate">
                <!-- @todo fix send here to be disabled when first opened -->
                <!-- Link to actual function -->
                <v-btn
                  :disabled="!valid"
                  color="success"
                  class="mr-4"
                  @click="dialog = false, snackbar = true"
                >Send</v-btn>
              </div>
            </v-form>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
    <!-- Close dialog -->
    <v-snackbar v-model="snackbar" :timeout="snackbarTimeOut">
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
    }
  }
};
</script>