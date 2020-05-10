/**
 * Vuex generic setter function
 * Used to reduce new mutation functions needed as setter for every single state value
 */

function setter(state, newState) {
  if (newState instanceof Array) state[newState[0]] = newState[1];
  else if (newState.key && newState.value) state[newState.key] = newState.value;
  else throw new Error("Invalid data type passed to setter");
}

export default setter;

/**
 * Deep setter
 * @notice Yet to be tested.
 */
function deepSetter(state, newState) {
  console.log("deepSetter", newState, state.user);
  const path = newState.split(".");
  const storeObj = state[path[0]];

  let key = storeObj;
  for (let i = 0; i < path.length; i++) {
    key = key[path[i]];
  }
  key = newState[1];

  state[path[0]] = storeObj; // Is this line needed?
  console.log("deepSetter", newState, state.user);
  return;
}
