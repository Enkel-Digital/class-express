/**
 * @todo
 * Explore using websockets for requesting for classes as it will be a lot... or would it be?
 * Basically the first time I getClass, I establish a websocket connection, then after 2 mins of inactivity or when the app quits,
 * kill the connection in here gracefully to prevent the server from relying on a 1 hour default timeout.
 * OR should the server implement the timeout? Like within 1 min no additional request, close it, then on client,
 * if no available connections, create a new one and get data?
 *
 * Is websocket even designed for this usecase or should we use smth else for sustained connections?
 * Since websocket main goal is bidirectional comms right?
 *
 * @todo
 * Setup the state so that vuex-persistedstate only stores the class IF the class is
 * part of upcoming or favourites where it will be used more commonly, if it is a
 * normal class like from search or smth, then is fine to just clear it on closing app
 *
 *
 *
 * Update this to stop using fetch and use DB call directly?
 * If we use firestore directly, will it handle caching for us?
 */

import api from "@/store/utils/fetch";
import apiError from "@/store/utils/apiError";
// import apiWithLoader from "@/store/utils/apiWithLoader";

/**
 * The purpose of the current classesToFetch "Queue" is just to ensure that if getClass is called repeatedly
 * with the same classID before the first call resolves, it would not make 2 calls to the API and instead ignore
 * the getClass request from the second time onwards.
 *
 * This is a internal in memory Queue instead of being in the state for better performance
 */
const classesToFetch = {};

/**
 * Inner function to request for a class with "classID" to fetch from server if not available locally.
 * Will populate the class into state once server responds.
 * Alternatively caller can also await this to get back the class object
 * @function _getClass
 */
async function _getClass(classes, commit, classID) {
  if (!classID) return;

  // Skip if class details is already downloaded and cached locally
  // Skip if classID is already requested for but not fulfilled yet
  // @todo Return the class if in state and the promise if it is still pending, save the promise to classesToFetch queue?
  if (classes[classID] || classesToFetch[classID]) return;

  // Set classID into "Queue" to prevent getClass from being called again with same ID before this class is fetched
  classesToFetch[classID] = true;

  const response = await api.get(`/class/details/${classID}`);

  // @todo See if this.call(this) is actually valid
  if (!response.success) return apiError(response, () => this.call(this));

  // Rename to classObject to prevent naming conflict with "class" keyword
  const classObject = response.class;

  // Save classObject to state
  commit("addClass", classObject);

  // Clear classID from the fetch list
  delete classesToFetch[classID];

  // Return class to allow caller to get class back if they would like to instead of relying on mapState
  return classObject;
}

/**
 * Function to request for class(es) with "classID(s)" to fetch from server if not available locally.
 * Will populate the class into state once server responds.
 * Returns the requested classObject if value does not exist in state and not previously requested for.
 * However do not rely on the return value as if it is already in state or previously requested for it will return undefined
 * @function getClass
 * @param classes Classes object in classes vuex module's state
 * @param commit Commit method from vuex action of classes vuex module
 * @param {(Number|Number[])} classID A classID or a list of classID that will be requested from server if needed
 * @returns {(undefined | Promise<ClassObject> | Promise<ClassObject>[])} A promise or an array of promise that resolves to class object(s)
 */
async function getClass(classes, commit, classID) {
  if (Array.isArray(classID))
    return classID.map((id) => _getClass(classes, commit, id));
  else return _getClass(classes, commit, classID);
}

export default getClass;
