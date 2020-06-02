import { ERROR, createError } from "./error"; // used to create undefined error type if did not get an error with a TYPE attribute
import formatErrorForPost from "./formatErrorForPost";

/**
 * errorController factory function
 * @function errorControllerFF
 * @param {*} Vue Vue class/module received from the install method of the plugin
 * @returns errorController
 */
export default function errorControllerFF(Vue, router, postToErrorService) {
  const state = Vue.observable({ errors: {} });

  return {
    // Attach error module's export on the controller too
    ERROR,
    createError,

    // Getters namespace
    getters: {
      /**
       * Getter to get the earliest error to be displayed
       * Does not order the errors depending on dismissability
       */
      displayEarliestError() {
        // Start with any random first element of Object.values array to start off the comparison
        let earliestError = Object.values(state.errors)[0];

        for (const errorID in state.errors) {
          const error = state.errors[errorID];
          if (!error.display) continue;
          else if (error.time < earliestError.time) earliestError = error;
        }

        return earliestError;
      },
      errorCount() {
        return Object.keys(state.errors).length;
      },
    },

    /** Initialize this plugin/module by clearing all errors */
    init() {
      this.clearAll();
    },
    /**
     * @example
     * // Where error is either an instance of Error or custom error object
     * this.$error.new(error); // From component
     * Vue.$error.new(error); // Using global Vue module
     * @todo Detect if error is undefined or {} or ! created using createError, and create a new UNKNOWN error with createError
     */
    async new(error) {
      try {
        console.error("error plugin:", error instanceof Error, error);

        // If error class instance, use the message alone
        if (error instanceof Error) {
          error = createError(ERROR.level.FATAL, ERROR.type.UNKNOWN, {
            instanceofError: true,
            errorMessage: error.message,
          });
        }

        /* Populate error object with default values and other custom properties */
        // Keep generating rand errorID till no more collisions
        do {
          // @todo Remove this errorID before posting to the service
          // Actually the error service should be the one that returns a errorID for the user to track
          // so the user can use the ID to email us and stuff.
          // right now, our contact us page cant do much, I want the contact us button to open a email with pre-filled contents
          error.errorID = Math.random().toString(36).substring(2);
        } while (state.errors[error.errorID]);
        // Display the error if not specified
        if (error.display === undefined) error.display = true;
        // If error is to be displayed and dismissable is not set, make it display by default
        if (error.dismissable === undefined && error.display)
          error.dismissable = true;

        // Add timestamp to error object
        error.time = Date.now();

        // After error object is created, push it into state
        Vue.set(state.errors, error.errorID, error);

        // Try reporting error to API if possible using the custom API caller instead. Refer to function's for doc on why.
        const response = await postToErrorService(
          formatErrorForPost(error, router)
        );

        if (response.success) {
          if (process.env.NODE_ENV !== "production") console.log(response);
        } else
          throw new Error(
            "Attempt to report Previous error to developers failed."
          );

        return error.errorID;
      } catch (error) {
        console.error("error in error handling plugin $error.new()", error);

        // Create new error to be displayed
        const displayError = createError(
          ERROR.level.FATAL,
          ERROR.type.INTERNAL,
          {
            failureInErrorPlugin: true,
            error: error.message,
          }
        );
        // Add error message to the error description
        displayError.description +=
          "<br />Failed in error plugin with: " + error.message;

        // Add call to action to contact us, just in case something failed before postToErrorService,
        // and error is not even sent to error service
        displayError.description +=
          "<br />Try contacting directly by screenshoting this and emailing instead?";

        // Make error dialog non dismissable
        displayError.dismissable = false;

        Vue.set(
          state.errors,
          Math.random().toString(36).substring(2),
          displayError
        );
      }
    },
    /**
     * @example
     * this.$error.clear(); // Clear a error with errorID from a component
     * Vue.$error.clear(); // Clear a error with errorID from anywhere using global Vue module
     */
    clear(errorID) {
      Vue.delete(state.errors, errorID);
    },
    /**
     * @example
     * this.$error.clearAll(); // Clear all errors from a component
     * Vue.$error.clearAll(); // Clear all errors from anywhere using global Vue module
     */
    clearAll() {
      // Reset state by clearing it directly
      Vue.delete(state, "errors");
      Vue.set(state, "errors", {});
    },
  };
}
