// Import AuthType Enum
import AuthType from "./AuthType";

/** @notice Pre-Load all components for frequently used routes */
import Home from "../views/Home.vue";
import Explore from "../views/Explore.vue";
import Favourites from "../views/Favourites.vue";
import Upcoming from "../views/Upcoming.vue";

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
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/explore",
    name: "explore",
    component: Explore,
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/favourites",
    name: "favourites",
    component: Favourites,
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/upcoming",
    name: "upcoming",
    component: Upcoming,
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/partner/:partnerID",
    name: "partner",
    component: () => import("@/views/Partner.vue"),
    meta: { Auth_requirements: AuthType.private },
    props: true,
  },
  {
    path: "/partner/classes/:partnerID",
    name: "partner-classes",
    component: () => import("@/views/PartnerClasses.vue"),
    meta: { Auth_requirements: AuthType.private },
    props: true,
  },
  {
    path: "/classdetails/:classID/:selectedTime?",
    name: "ClassDetails",
    component: () => import("@/views/ClassDetails.vue"),
    meta: { Auth_requirements: AuthType.private },
    props: true,
  },
  {
    path: "/reviews/class/:classID",
    name: "reviews-class",
    component: () => import("@/views/Reviews.vue"),
    meta: { Auth_requirements: AuthType.private },
    props: true,
  },
  {
    path: "/reviews/partner/:partnerID",
    name: "reviews-partner",
    component: () => import("@/views/Reviews.vue"),
    meta: { Auth_requirements: AuthType.private },
    props: true,
  },
  {
    path: "/new-review/:classID",
    name: "new-review",
    component: () => import("@/views/NewReview.vue"),
    meta: { Auth_requirements: AuthType.private },
    props: true,
  },
  {
    path: "/schedule/class/:classID",
    name: "schedule-class",
    component: () => import("@/views/ClassSchedule.vue"),
    meta: { Auth_requirements: AuthType.private },
    props: true,
  },
  {
    path: "/schedule/partner/:partnerID",
    name: "schedule-partner",
    component: () => import("@/views/PartnerSchedule.vue"),
    meta: { Auth_requirements: AuthType.private },
    props: true,
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/views/Profile.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/topup",
    name: "topup",
    component: () => import("@/views/Topup.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/subscription",
    name: "subscription",
    component: () => import("@/views/SubscriptionPlan.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/subscription/cancel",
    name: "cancel-subscription",
    component: () => import("@/views/CancelSubscription.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("@/views/Settings.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/past/classes",
    name: "PastClasses",
    component: () => import("@/views/PastClasses.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/payment",
    name: "payment",
    component: () => import("@/views/CreateCustomerAndPaymentMethod.vue"),
    meta: { Auth_requirements: AuthType.private },
    props: (route) => route.query,
  },
];

export default routes;
