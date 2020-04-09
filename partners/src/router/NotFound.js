// Import AuthType Enum
import AuthType from "./AuthType";

const routes = [
  {
    path: "/**",
    // Make this a wild card so any invalid name comes here
    name: "*",
    component: () => import("../views/NotFound.vue"),
    meta: { Auth_requirements: AuthType.public }
  }
];

export default routes;
