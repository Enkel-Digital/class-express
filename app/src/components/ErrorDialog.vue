<template>
  <!-- @notice Normal way to trigger the dialog to show -->
  <!-- <v-dialog v-model="error" persistent> -->

  <!--
      @notice Add conditional rendering plus alwaysShow = true to ensure that,
      the component is only rendered/created when there is an error and not always created + hidden.
      Which will presumably reduces memory usage as the component is not create yet.
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

      <div v-if="actions">
        <v-card-actions
          v-for="(action, actionName) of actions"
          :key="actionName"
        >
          <v-spacer />
          <!-- @notice Action is passed to dimiss, to dismiss the error and execute the action with "this" binding -->
          <v-btn color="primary" text @click="dismiss(action)">
            {{ actionName }}
          </v-btn>
        </v-card-actions>
      </div>

      <!-- Update their on clicks -->
      <v-card-actions v-if="error.dismissable">
        <v-spacer />
        <!--
          @notice Calling dismiss directly instead of passing function to be executed, to ensure click event object is not
          passed in as the first function arguement to match the usage of dismiss(action) when an action function is available
        -->
        <v-btn color="red darken-1" text @click="dismiss()">
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
    error() {
      // If no error, return undefined to prevent component from rendering
      if (!this.$store.getters["error/displayableErrors"].length) return;

      // Clone earliest error from the displayable errors array
      // Cloning error to display to prevent modifying state
      const error = cloneDeep(
        this.$store.getters["error/displayableErrors"][0]
      );

      // Add defaults UI flags if not available
      // @todo This should be the unknown error type and should be set in the error mod
      // @todo In fact this whole thing should just be returning the first value of the error getter
      if (!error.name) error.name = "UNKNOWN";
      if (!error.description) error.description = "Unknown error occurred 😫";

      return error;
    },
    actions() {
      if (this.error.more && this.error.more.actions)
        return this.error.more.actions;
      else return null;
    },
  },
  methods: {
    /**
     * Dismiss error and execute action if available with VueComponent object passed in.
     * @function dismiss
     * @params actions
     */
    dismiss(action) {
      this.$store.dispatch("error/clear", this.error.ID);
      if (action) return action(this);
    },
  },
};
</script>
