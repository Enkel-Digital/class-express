import { auth } from "firebase";

/**
 * Signout current user, clear vuex store state and redirect to welcome view.
 * @function logout
 */
export default async function logout() {
  if (!confirm("Logout?")) return;

  // Signout current user
  await auth().signOut();

  // Notify user that they are now logged out
  alert("You have now been logged out");

  // Redirect to welcome view
  this.$router.push({ name: "welcome" });
}
