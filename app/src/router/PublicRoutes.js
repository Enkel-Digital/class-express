// Import AuthType Enum
import AuthType from "./AuthType";

/** @notice Pre-Load all components for frequently used routes */

/**
 * @notice Some of these less frequented routes uses lazily loaded components
 *
 * route level code-splitting
 * this generates a separate chunk (about.[hash].js) for this route
 * which is lazy-loaded when the route is visited.
 */
const routes = [
  {
    path: "/",
    name: "welcome",
    component: () => import("@/views/Welcome.vue"),
    meta: { Auth_requirements: AuthType.public_only },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
    meta: { Auth_requirements: AuthType.public_only },
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("@/views/Signup.vue"),
    meta: { Auth_requirements: AuthType.public_only },
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/About.vue"),
    meta: { Auth_requirements: AuthType.public },
  },
];

export default routes;
