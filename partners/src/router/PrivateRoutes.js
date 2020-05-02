// Import AuthType Enum
import AuthType from "./AuthType";

/** @notice Pre-Load all components for frequently used routes */
import Home from "../views/Home.vue";
import Profile from "../views/Profile.vue";
import schedule from "../views/Schedule.vue";
import AllClasses from "../views/AllClasses.vue";
import ClassDetails from "../views/ClassDetails.vue";
import AddNewClass from "../views/AddNewClass.vue";
import AllReviews from "../views/AllReviews.vue";
import Reviews from "../views/Reviews.vue";
import Earnings from "../views/Earnings.vue";

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
    path: "/schedule",
    name: "view-schedule",
    component: schedule,
    meta: { Auth_requirements: AuthType.private }
  },
  {
    path: "/schedule/:classID",
    name: "schedule",
    component: schedule,
    meta: { Auth_requirements: AuthType.private },
    props: true
  },
  {
    path: "/class/all",
    name: "all-classes",
    component: AllClasses,
    meta: { Auth_requirements: AuthType.private }
  },
  {
    path: "/class/add",
    name: "new-class",
    component: AddNewClass,
    meta: { Auth_requirements: AuthType.private }
  },
  {
    path: "/classdetails/:classID",
    name: "ClassDetails",
    component: ClassDetails,
    meta: { Auth_requirements: AuthType.private },
    props: true
  },
  {
    path: "/reviews/all",
    name: "all-reviews",
    component: AllReviews,
    meta: { Auth_requirements: AuthType.private }
  },
  {
    path: "/earnings",
    name: "earnings",
    component: Earnings,
    meta: { Auth_requirements: AuthType.private }
  },
  {
    path: "/reviews/:classID",
    name: "reviews",
    component: Reviews,
    meta: { Auth_requirements: AuthType.private },
    props: true
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
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
