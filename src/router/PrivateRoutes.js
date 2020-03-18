// Import AuthType Enum
import AuthType from "./AuthType";

/** @notice Pre-Load all components for frequently used routes */
import Home from "../views/Home.vue";
import Profile from "../views/Profile.vue";
import Topup from "../views/Topup.vue";
import Explore from "../views/Explore.vue";
import Upcoming from "../views/Upcoming.vue";
import ClassDetails from "../views/ClassDetails.vue";

/**
 * @notice Some of these less frequented routes uses lazily loaded components
 *
 * route level code-splitting
 * this generates a separate chunk (about.[hash].js) for this route
 * which is lazy-loaded when the route is visited.
 */
const routes = [
  {
    path: "/home",
    name: "home",
    component: Home,
    meta: { Auth_requirements: AuthType.private }
  },
  {
    path: "/explore",
    name: "explore",
    component: Explore,
    meta: { Auth_requirements: AuthType.private }
  },
  {
    path: "/classdetails",
    name: "ClassDetails",
    component: ClassDetails,
    meta: { Auth_requirements: AuthType.private }
  },
  {
    path: "/upcoming",
    name: "upcoming",
    component: Upcoming,
    meta: { Auth_requirements: AuthType.private }
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
    meta: { Auth_requirements: AuthType.private }
  },
  {
    path: "/topup",
    name: "topup",
    component: Topup,
    meta: { Auth_requirements: AuthType.private }
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("@/views/Settings.vue"),
    meta: { Auth_requirements: AuthType.private }
  }
];

export default routes;
