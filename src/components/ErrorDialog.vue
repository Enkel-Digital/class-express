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
        Issue is reported to the developer 🙏🏻
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
import cloneDeep from "lodash.clonedeep";

export default {
  name: "ErrorDialog",
  data() {
    return {
      alwaysShow: true,
    };
  },
  computed: {
    // @todo If we use array of errors, what if there is one that is non dismissable?
    // @todo In that case, should we allow users to page through all the errors to see them all?
    error() {
      // Clone earliest error from the errors array
      // Cloning error to display to prevent modifying state
      const error = cloneDeep(this.$store.state.error.errors[0]);
      if (!error) return false; // If no error return false to prevent component from rendering

      // Add defaults UI flags if not available
      if (!error.name) error.name = "UNKNOWN";
      if (!error.description) error.description = "Unknown error occurred 😫";
      if (!error.dismissable) error.dismissable = true; // Dismissable by default

      return error;
    },
  },
  methods: {
    dismiss() {
      /**
       * @todo Clear an error by passing in an ID
       * So I can keep showing all the error in the errors array till it is no more.
       * But by default clear with ID === 0 since we are reading errors[0] makes sense to delete errors[0]
       * Error shown and error deleted needs to be the same....
       * Perhaps we should have another computed property or smth to decide which error to show from the array
       */
      this.$store.dispatch("error/clear");
    },
  },
};
</script>
