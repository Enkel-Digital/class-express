import Vue from "vue";
import VueRouter from "vue-router";
import RouteGaurd from "./RouteGaurd";

// Import the private and public routes
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import NotFound from "./NotFound";

// Attach use of vue route to the vue object instance
Vue.use(VueRouter);

const router = new VueRouter({
  // Scroll to top for all route navigations, and if there is a savedPosition it will result in native-like behavior when navigating with back/forward buttons
  scrollBehavior: (to, from, savedPosition) =>
    savedPosition ? savedPosition : { x: 0, y: 0 },

  routes: [...PrivateRoutes, ...PublicRoutes, ...NotFound],
});

// Attach Router Gaurd Middleware function to run when navigation is made before the actual navigation.
router.beforeEach(RouteGaurd);

export default router;
