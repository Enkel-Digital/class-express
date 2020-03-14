import Vue from "vue";
import VueRouter from "vue-router";
import RouteGaurd from "./RouteGaurd";

// Import the private and public routes
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";

// Attach use of vue route to the vue object instance
Vue.use(VueRouter);

const router = new VueRouter({
  routes: [...PrivateRoutes, ...PublicRoutes]
});

// Attach Router Gaurd Middleware function to run when navigation is made before the actual navigation.
router.beforeEach(RouteGaurd);

export default router;
