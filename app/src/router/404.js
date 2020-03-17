// Import AuthType Enum
import AuthType from "./AuthType";

const routes = [
  {
    path: "/**",
    name: "404",
    component: () => import("../views/404.vue"),
    meta: { Auth_requirements: AuthType.public }
  }
];

export default routes;
