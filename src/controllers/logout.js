import firebase from "firebase";

/**
 * Signout current user, clear vuex store state and redirect to welcome view.
 * @function logout
 */
export default async function logout() {
  // Signout current user
  await firebase.auth().signOut();

  // Notify user that they are now logged out
  alert("You have now been logged out");

  // Redirect to welcome view
  this.$router.push({ name: "welcome" });
}
