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

import Vue from "vue";
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
 */
async function _getClass(classes, commit, classID) {
  if (!classID) return;

  // Skip if class details is already downloaded and cached locally
  // Skip if classID is already requested for but not fulfilled yet
  // Return the class if in state and the promise (that is saved in the classesToFetch queue) if it is still pending
  if (classes[classID]) return classes[classID];

  /*
    When this function is called and the API request has been made, instead of returning the
    promise in the queue directly, we await the promise here first for the caller to "await".
    
    This is because, the promise stored inside the classesToFetch queue is actually the network request promise,
    which resolves into the response object from the API. Since we only want to return either the Class object
    or undefined from this function, we need to await the request promise, before returning the Class Object if
    the API request succeeded, or do an explicit "return undefined" to match the function signature.
    
    Why doesnt this section need to do things like handle API error and state mutation?
    tl;dr The code below handles it all when the API call promise resolves.
    
    Unlike the code below that awaits for the promise and handle deleting the promise from the Queue and
    handling API errors, when the promise resolves, this section for awaiting the Class object does not.
    Since we can await the same promise multiple times, this is just another part that awaits for the same
    promise. When the original call to the function / returned-promise, completes the API call, it will
    handle all the things needed to be done, so this section just needs to await and return the class object
    if succeeded and does not need to handle anything else.
  */
  if (classesToFetch[classID]) {
    const response = await classesToFetch[classID];
    if (response.success) return response.class;
    else return; // Explicit end of function to prevent execution from continuing and re-running the API call.
  }

  const responsePromise = api.get(`/class/details/${classID}`);

  // Set classID into "Queue" to prevent getClass from being called again with same ID before this class is fetched
  classesToFetch[classID] = responsePromise;

  const response = await responsePromise;

  // Clear classID immediately after API resolves to prevent this from being uncleared if retries if API failed
  delete classesToFetch[classID];

  // @todo Returning apiError will mess up caller's code, which may depend on getting back the class object or undefined
  // @todo If res fails but the reason is because invalid classID, maybe I should do smth else instead?
  if (!response.success)
    return apiError(
      response,
      _getClass.bind(this, classes, commit, classID),
      `Failed to fetch Class Details for Class "${classID}"`
    );

  // Rename to classObject to prevent naming conflict with "class" keyword
  const classObject = response.class;

  // Save classObject to state
  commit("addClass", classObject);

  // Return class to allow caller to get class back if they would like to instead of relying on mapState
  return classObject;
}

/**
 * Store action used to wrap over _getClass to inject in state and commit method
 * Function to request for class(es) with "classID(s)" to fetch from server if not available locally.
 * Will populate the class into state once server responds.
 * Returns the requested classObject if value does not exist in state and not previously requested for.
 * However do not rely on the return value as if it is already in state or previously requested for it will return undefined
 * @param classes Classes object in classes vuex module's state
 * @param commit Commit method from vuex action of classes vuex module
 * @param {(Number|Number[])} classID A classID or a list of classID that will be requested from server if not available locally
 * @returns {(undefined | Promise<ClassObject> | Promise<ClassObject>[])} A promise or an array of promise that resolves to class object(s)
 */
async function getClass({ state, commit }, classID) {
  if (Array.isArray(classID))
    return classID.map((id) => _getClass(state.classes, commit, id));
  else return _getClass(state.classes, commit, classID);
}

function addClass(state, classObject) {
  Vue.set(state.classes, classObject.id, classObject);
}

export { _getClass, getClass, addClass };
