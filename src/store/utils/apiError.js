import { ERROR, createError } from "vue-error-controller";
import Vue from "vue";

/**
 * Simple wrapper error.new and createError to create an API error, which will be used throughout the code base
 * @notice You still can deal with errors locally in the component that called the action that failed as returning apiError(),
 * @notice will return the errorID which you can use to get the error from vuex error module
 *
 * @example
 * // Make an API call, and if it failed, show user the ErrorDialog, and give a retry option,
 * // where the retry button on click will run this action again with the same arguments
 * // The first argument for retry method is always the vue component of ErrorDialog.
 * // use self as retry function's argument to prevent conflict with "this"
 * async YOUR_VUEX_ACTION({ commit }, ACTION_ARGUEMENT) {
 *  // If the retry strategy is to dispatch this action again,
 *  // CODE BLOCK before the api call and apiError call needs to be indempotent!!!
 *  // Basically to make everything before API call to be indempotent to allow for retries.
 *
 *  const response = await api.get("YOUR_API_ENDPOINT");
 *  if (!response.success)
 *    // Always return to ensure that function execution stops here.
 *    return apiError(response, (self) =>
 *      self.$store.dispatch("YOUR_VUEX_ACTION", ACTION_ARGUEMENT)
 *    );
 *
 *  // Only modify state if API is successful so this action's first part before the api call must be indempotent
 *  commit("MUTATION_NAME", MUTATION_PAYLOAD);
 * }
 *
 * @example
 * // Alternatively, you use "context" object's dispatch method, passed in via actions first argument
 * // This is usually preferred when working in a module, so you can dispatch without needing to add namespace
 * async YOUR_VUEX_ACTION({ commit }, ACTION_ARGUEMENT) {
 *  const response = await api.get("YOUR_API_ENDPOINT");
 *  if (!response.success)
 *    return apiError(response, () => dispatch("YOUR_VUEX_ACTION", ACTION_ARGUEMENT));
 *
 *  // Only modify state if API is successful so this action's first part before the api call must be indempotent
 *  commit("MUTATION_NAME", MUTATION_PAYLOAD);
 * }
 *
 * @notice The errorID is returned from error/new action to error.new method to apiError then to the caller of this action.
 * @notice The action needs to detemine how the action caller know that this is an errorID and not any other return value from the action
 * @todo Should also attach original error object as extended "more" property "original" for local use
 */
export default function apiError(response, retry, moreDescription) {
  // Return to allow the returned errorID from the action to bubble up.
  return Vue.$error.new(
    createError(ERROR.level.RETRY, ERROR.type.API, {
      reponseError: response.error || response,
      actions: { retry },
      description: moreDescription,
    })
  );
}
