<template>
  <!-- @notice Normal way to trigger the dialog to show -->
  <!-- <v-dialog v-model="error" persistent> -->

  <!--
      @notice Add conditional rendering plus alwaysShow = true to ensure that,
      the component is only rendered/created when there is an error and not always created + hidden.
      Which will presumably reduces memory usage as the component is not create yet.
    -->
  <v-dialog v-if="error" v-model="alwaysShow" persistent max-width="40%">
    <v-card>
      <p class="overline ma-4 pa-4 mb-0 pb-0" style="color: red">
        sadly, there is ({{ errorCount }}) error(s)
      </p>
      <v-card-title
        v-html="error.name"
        class="headline mt-0 pt-0"
        style="text-align: left"
      />

      <!-- Default error description for the specific Error type -->
      <v-card-text v-html="error.description" style="text-align: left" />

      <!-- Custom extra error description developers can add for a specific Error instance -->
      <v-card-text
        v-if="error.more && error.more.description"
        v-html="error.more.description"
        style="text-align: left"
      />

      <!-- Allow debug directly from error dialog component using a "dropdown" view -->
      <v-card-text v-if="error.more" style="text-align: left">
        <details>
          <summary>
            <h3 style="display: inline; text-decoration: none">
              <b><i>More debug info</i></b>
            </h3>
          </summary>
          <ul>
            <li v-for="(detail, i) in error.more" :key="i" v-html="detail" />
          </ul>
        </details>
      </v-card-text>

      <v-card-text style="text-align: left">
        Issue reported to the developer 🙏🏻
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
        <v-btn color="red darken-1" text @click="dismiss()"> dismiss </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// Error dialog to display errors from the error controller plugin

export default {
  name: "ErrorDialog",
  data() {
    return {
      alwaysShow: true,
    };
  },
  computed: {
    // wrap it inside functions to access "this" vue instance injected in
    error() {
      return this.$error.getters.displayEarliestError();
    },
    errorCount() {
      return this.$error.getters.errorCount();
    },
    actions() {
      if (this.error.more && this.error.more.actions)
        return this.error.more.actions;
      else return false; // Return false to work with v-if
    },
  },
  methods: {
    /**
     * Dismiss error and execute action if available with VueComponent object passed in.
     * @function dismiss
     * @param actions
     */
    dismiss(action) {
      this.$error.clear(this.error.errorID);
      if (action) return action(this);
    },
  },
};
</script>
