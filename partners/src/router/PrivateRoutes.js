// Import AuthType Enum
import AuthType from "./AuthType";

/** @notice Pre-Load components for frequently used routes */

/**
 * @notice Right now all routes are being lazy loaded. Might change in the future.
 *
 * route level code-splitting
 * this generates a separate chunk (about.[hash].js) for this route
 * which is lazy-loaded when the route is visited.
 */
const routes = [
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/Home.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    // Partner's schedule for all classes
    // @todo Add support for "Partner's schedule for a selected class" prop
    path: "/schedule/:classID?",
    name: "view-schedule",
    component: () => import("@/views/Schedule.vue"),
    meta: { Auth_requirements: AuthType.private },
    props: true,
  },
  {
    path: "/class/all",
    name: "all-classes",
    component: () => import("@/views/AllClasses.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/class/add",
    name: "new-class",
    component: () => import("@/views/AddNewClass.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/classdetails/:classID",
    name: "ClassDetails",
    component: () => import("@/views/ClassDetails.vue"),
    meta: { Auth_requirements: AuthType.private },
    props: true,
  },
  {
    path: "/reviews/all",
    name: "all-reviews",
    component: () => import("@/views/AllClasses.vue"),
    meta: { Auth_requirements: AuthType.private },
    props: { routeName: "reviews" },
  },
  {
    path: "/bookings",
    name: "bookings",
    component: () => import("@/views/Bookings.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/earnings",
    name: "earnings",
    component: () => import("@/views/Earnings.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/earnings/history",
    name: "earningsHistory",
    component: () => import("@/views/EarningsHistory.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/reviews/:classID",
    name: "reviews",
    component: () => import("@/views/Reviews.vue"),
    meta: { Auth_requirements: AuthType.private },
    props: true,
  },
  {
    path: "/partnerProfile",
    name: "partnerProfile",
    component: () => import("@/views/PartnerProfile.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("@/views/Settings.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/withdrawal",
    name: "withdrawal",
    component: () => import("@/views/Withdrawal.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/employee/manage",
    name: "manage-employee",
    component: () => import("@/views/ManageEmployee.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
];

export default routes;
