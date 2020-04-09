// @todo Remove mock data
import mock from "../../mockData";

/**
 * Add a classID to "Queue" to get the details fetched and remove when it is done
 * @function getClass
 */
function getClass({ state, commit }, classID) {
  // Skip if class details is already downloaded and cached locally
  // Skip if classID is already requested for but not fulfilled yet
  if (state.classes[classID] || state.classesToFetch[classID]) return;

  // Add classID to classesToFetch
  commit("updateClassesToFetch", { classID, add: true });

  // @todo Replace with API call
  const fakeFetch = (url, callback) =>
    setTimeout(() => callback(mock.classes[classID]), 4000);

  fakeFetch("testing url", classObject => {
    console.log("setting now", state.classes[classID]);

    // state.classes[classID] = classObject;
    commit("class", { classObject, add: true });

    console.log("setting now2", state.classes[classID]);

    // Clear the classID from the fetch list
    commit("updateClassesToFetch", { classID, remove: true });
  });
}

export default getClass;
