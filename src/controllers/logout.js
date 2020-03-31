import { auth } from "firebase";
import store from "../store/index";
// import initialState from "../store/initialState";

/**
 * Signout current user, clear vuex store state and redirect to welcome view.
 * @function logout
 */
export default async function logout() {
  if (!confirm("Logout?")) return;

  // Signout current user
  await auth().signOut();

  console.log("logout is called");
  console.log("state before replace: ", store.state);

  // Clear vuex state by replacing the entire state with the initial state
  // store.replaceState(initialState());

  // Have to somehow clear the state of all the modules too.

  console.log("state after replace: ", store.state);

  // Clear localStorage used by "vuex-persistedstate" package
  localStorage.clear();

  // Redirect to welcome view
  this.$router.push({ name: "welcome" });
}
