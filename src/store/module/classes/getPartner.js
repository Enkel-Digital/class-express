/**
 * getPartner function to get partner details from API
 */

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
 * @function _getPartner
 */
async function _getPartner(partners, commit, partnerID) {
  // Skip if partner details is already downloaded and cached locally
  // Skip if partnerID is already requested for but not fulfilled yet
  if (partners[partnerID] || partnersToFetch[partnerID]) return;

  // Set partnerID into "Queue" to prevent getPartner from being called again with same ID before this partner is fetched
  partnersToFetch[partnerID] = true;

  const response = await api.get(`/partner/details/${partnerID}`);

  // @todo See if this.call(this) is actually valid
  if (!response.success) return apiError(response, () => this.call(this));

  const { partner } = response;

  // Save partner to state
  commit("addPartner", partner);

  // Clear partnerID from the fetch list
  delete partnersToFetch[partnerID];

  // Return partner to allow caller to get partner back if they would like to instead of relying on mapState
  return partner;
}

/**
 * Function to request for partner(es) with "partnerID(s)" to fetch from server if not available locally.
 * Will populate the partner into state once server responds.
 * Returns the requested partnerObject if value does not exist in state and not previously requested for.
 * However do not rely on the return value as if it is already in state or previously requested for it will return undefined
 * @function getPartner
 * @param partners Partners object in classes vuex module's state
 * @param commit Commit method from vuex action of classes vuex module
 * @param {(Number|Number[])} partnerID A partnerID or a list of partnerID that will be requested from server if needed
 * @returns {(undefined | Promise<partnerObject> | Promise<partnerObject>[])} A promise or an array of promise that resolves to partner object(s)
 */
async function getPartner(partners, commit, partnerID) {
  if (Array.isArray(partnerID))
    return partnerID.map((id) => _getPartner(partners, commit, id));
  else return _getPartner(partners, commit, partnerID);
}

export default getPartner;
