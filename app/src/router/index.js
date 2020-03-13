import Vue from "vue";
import VueRouter from "vue-router";

import Home from "../views/Home.vue";
import Profile from "../views/Profile.vue";
import Explore from "../views/Explore.vue";
import Upcoming from "../views/Upcoming.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/explore",
    name: "explore",
    component: Explore
  },
  {
    path: "/upcoming",
    name: "upcoming",
    component: Upcoming
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
