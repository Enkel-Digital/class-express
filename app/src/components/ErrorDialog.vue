<template>
  <!-- @notice Normal way to trigger the dialog to show -->
  <!-- <v-dialog v-model="error" persistent> -->

  <!--
      @notice Add conditional rendering plus alwaysShow = true to ensure that,
      the component is only rendered/created when there is an error and not always created but hidden.
      This presumably reduces memory usage as the component is not create yet.
    -->
  <v-dialog v-if="error" v-model="alwaysShow" persistent>
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
  name: "ErrorDialog",
  beforeMount() {
    // @todo Remove this tmp solution to clear error when the page first loads.
    this.$store.dispatch("error/clear");
  },
  data() {
    return {
      alwaysShow: true,
    };
  },
  computed: {
    error() {
      const error = this.$store.state.error.errors[0];
      if (!error) return false; // If no error return false to prevent component from rendering

      // Add defaults UI flags if not available
      if (!error.name) error.name = "UNKNOWN";
      if (!error.description) error.description = "Unknown error occurred 😫";
      if (!error.dismissable) error.dismissable = true;

      return error;
    },
  },
  methods: {
    dismiss() {
      this.$store.dispatch("error/clear");
    },
  },
};
</script>
