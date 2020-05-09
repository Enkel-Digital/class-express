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
