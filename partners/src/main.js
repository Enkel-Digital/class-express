import setupOutcome from "./setup"; // Returns either true or false

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import vuetify from "./plugins/vuetify";
import firebase from "firebase/app";
import "firebase/auth";

import moment from "moment";
Vue.prototype.moment = moment;

import loader from "vue-loader-controller";
import customLoader from "./components/Loader.vue";
Vue.use(loader, { customLoader });

Vue.config.productionTip = false;

// Register global custom directive called `v-autofocus`
import autofocus from "./directives/autofocus";
Vue.directive("autofocus", autofocus);

// firebaseConfig auto generated in project settings
firebase.initializeApp({
  apiKey: "AIzaSyA6WspXWorAK_1HiwLAVht7-ujoUDdWsAs",
  authDomain: "class-express-partners.firebaseapp.com",
  projectId: "class-express-partners",
  storageBucket: "class-express-partners.appspot.com",
  appId: "1:671101516105:web:272b2cd00047f3eb36c298",
});

// Wait for firebase to finish initialization before creating the app.
// So that the router navigation wont break due to invalid auth
firebase.auth().onAuthStateChanged(() => {
  new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
  }).$mount("#app");
});
