<template>
  <v-dialog v-model="showDialog" persistent>
    <v-card>
      <p class="overline ma-4 pa-4 mb-0 pb-0" style="color: red;">
        sadly, there is an error
      </p>
      <v-card-title class="headline mt-0 pt-0" style="word-break: keep-all;">
        "{{ error.name }}"
      </v-card-title>
      <v-card-text style="text-align: left;">
        {{ error.description }}
      </v-card-text>

      <v-card-text style="text-align: left;">
        Issue has been reported to the developer 🙏🏻
        <br />
        Working on it now 💪🏻😁
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <!-- @todo Update the email address -->
        <v-btn color="green" text href="mailto:tech@enkeldigital.com">
          Contact us directly
        </v-btn>
      </v-card-actions>

      <!-- Update their on clicks -->
      <v-card-actions v-if="error.dismissable">
        <v-spacer />
        <v-btn color="red darken-1" text @click="dismiss">
          dismiss
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "error",
  beforeMount() {
    // @todo Remove this tmp solution to clear error when the page first loads.
    this.$store.dispatch("error/clear");
  },
  data() {
    // @example Error object
    // @todo Delete and integrate with the error handler vuex module
    const error = {
      name: "Network connection failed",
      description: "Failed to connect to API.",
      // Should the error be displayed on the errorDialog?
      display: true,
      // Can this error be dismissed via the errorDialog?
      dismissable: true
    };

    return {
      // @todo Remove the temporary error shown
      error
    };
  },
  computed: {
    showDialog() {
      return this.$store.state.error.error;
    }
  },
  methods: {
    dismiss() {
      this.$store.dispatch("error/clear");
    }
  }
};
</script>
