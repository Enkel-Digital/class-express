/**
 * getPartner function to get partner details from API
 */

import Vue from "vue";
import api from "@/store/utils/fetch";
import apiError from "@/store/utils/apiError";

/**
 * The purpose of the current partnersToFetch "Queue" is just to ensure that if getPartner is called repeatedly
 * with the same partnerID before the first call resolves, it would not make 2 calls to the API and instead ignore
 * the getPartner request from the second time onwards.
 *
 * This is a internal in memory Queue instead of being in the state for better performance
 */
const partnersToFetch = {};

/**
 * Inner function to request for a partner with "partnerID" to fetch from server if not available locally.
 * Will populate the partner into state once server responds.
 * Alternatively caller can also await this to get back the partner object
 */
async function _getPartner(partners, commit, partnerID) {
  if (!partnerID) return;

  // Skip if partner details is already downloaded and cached locally
  // Skip if partnerID is already requested for but not fulfilled yet
  // Return partner if in state and the promise (that is saved in the partnersToFetch queue) if it is still pending
  if (partners[partnerID]) return partners[partnerID];

  /*
    When this function is called and the API request has been made, instead of returning the
    promise in the queue directly, we await the promise here first for the caller to "await".
    
    This is because, the promise stored inside the partnersToFetch queue is actually the network request promise,
    which resolves into the response object from the API. Since we only want to return either the Partner object
    or undefined from this function, we need to await the request promise, before returning the Partner Object if
    the API request succeeded, or do an explicit "return undefined" to match the function signature.
    
    Why doesnt this section need to do things like handle API error and state mutation?
    tl;dr The code below handles it all when the API call promise resolves.
    
    Unlike the code below that awaits for the promise and handle deleting the promise from the Queue and
    handling API errors, when the promise resolves, this section for awaiting the Partner object does not.
    Since we can await the same promise multiple times, this is just another part that awaits for the same
    promise. When the original call to the function / returned-promise, completes the API call, it will
    handle all the things needed to be done, so this section just needs to await and return the Partner object
    if succeeded and does not need to handle anything else.
  */
  if (partnersToFetch[partnerID]) {
    const response = await partnersToFetch[partnerID];
    if (response.success) return response.partner;
    else return; // Explicit end of function to prevent execution from continuing and re-running the API call.
  }

  const responsePromise = await api.get(`/partner/details/${partnerID}`);

  // Set partnerID into "Queue" to prevent getPartner from being called again with same ID before this partner is fetched
  partnersToFetch[partnerID] = responsePromise;

  const response = await responsePromise;

  // Clear partnerID immediately after API resolves to prevent this from being uncleared if retries if API failed
  delete partnersToFetch[partnerID];

  // @todo Returning apiError will fk up caller's code, which may depend on getting back the Partner object or undefined
  // @todo If res fails but the reason is because invalid partnerID, maybe I should do smth else instead?
  if (!response.success)
    return apiError(
      response,
      _getPartner.bind(this, partners, commit, partnerID),
      `Failed to fetch Partner Details for Partner "${partnerID}"`
    );

  const { partner } = response;

  // Save partner to state
  commit("addPartner", partner);

  // Return partner to allow caller to get partner back if they would like to instead of relying on mapState
  return partner;
}

/**
 * Store action used to wrap over getPartner to inject in state and commit method
 * Function to request for partner(es) with "partnerID(s)" to fetch from server if not available locally.
 * Will populate the partner into state once server responds.
 * Returns the requested partnerObject if value does not exist in state and not previously requested for.
 * However do not rely on the return value as if it is already in state or previously requested for it will return undefined
 * @param partners Partners object in partners vuex module's state
 * @param commit Commit method from vuex action of partners vuex module
 * @param {(Number|Number[])} partnerID A partnerID or a list of partnerID that will be requested from server if not available locally
 * @returns {(undefined | Promise<partnerObject> | Promise<partnerObject>[])} A promise or an array of promise that resolves to partner object(s)
 */
async function getPartner({ state, commit }, partnerID) {
  if (Array.isArray(partnerID))
    return partnerID.map((id) => _getPartner(state.partners, commit, id));
  else return _getPartner(state.partners, commit, partnerID);
}

function addPartner(state, partnerObject) {
  Vue.set(state.partners, partnerObject.id, partnerObject);
}

export { _getPartner, getPartner, addPartner };
