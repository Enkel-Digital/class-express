import firebase from "firebase/app";
import "firebase/auth";
import store from "../store/index";
// import initialState from "../store/initialState";

/**
 * Signout current user, clear vuex store state and redirect to welcome view.
 * @function logout
 */
export default async function logout() {
  if (!confirm("Logout?")) return;

  // Signout current user
  await firebase.auth().signOut();

  console.log("logout is called");
  console.log("state before replace: ", store.state);

  // Clear vuex state by replacing the entire state with the initial state
  // store.replaceState(initialState());

  // Have to somehow clear the state of all the modules too.

  console.log("state after replace: ", store.state);

  // Clear storage mediums used for data storage by "vuex-persistedstate" plugin
  localStorage.clear();
  sessionStorage.clear();

  // Redirect to welcome view
  this.$router.push({ name: "welcome" });
}
